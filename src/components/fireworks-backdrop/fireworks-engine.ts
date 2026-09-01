import * as THREE from 'three'

export type FireworksPalette = 'night' | 'festival' | 'gold'
export type FireworksSky = 'dark' | 'light'

const PALETTES: Record<FireworksPalette, number[]> = {
  night: [0xffd27a, 0x8ecbff, 0xff9ec8, 0xf4f7ff],
  festival: [0xff4d4d, 0xffd166, 0x3ee0a0, 0xffffff],
  gold: [0xffe08a, 0xffb347, 0xfff6d6, 0xff7043],
}

const SKY: Record<FireworksSky, { bg: number; fog: number; ground: number }> = {
  dark: { bg: 0x02040c, fog: 0x02040c, ground: 0x05070f },
  light: { bg: 0x1a2744, fog: 0x1a2744, ground: 0x12182a },
}

const CYCLE = 24
const MAX_PARTICLES = 8200
const MAX_ROCKETS = 22

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function at(buf: Float32Array, index: number) {
  return buf[index] ?? 0
}

function addAt(buf: Float32Array, index: number, delta: number) {
  buf[index] = at(buf, index) + delta
}

function mulAt(buf: Float32Array, index: number, factor: number) {
  buf[index] = at(buf, index) * factor
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t))
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeInCubic(t: number) {
  return t * t * t
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function easeInExpo(t: number) {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10)
}

function smootherstep(t: number) {
  const x = clamp01(t)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

function makeSparkTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.1, 'rgba(255,248,230,0.9)')
  gradient.addColorStop(0.28, 'rgba(255,200,120,0.45)')
  gradient.addColorStop(0.55, 'rgba(255,140,60,0.08)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function randomOnSphere(out: THREE.Vector3) {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  out.set(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta))
  return out
}

export interface FireworksEngineOptions {
  palette?: FireworksPalette
  intensity?: number
  paused?: boolean
  sky?: FireworksSky
}

export class FireworksEngine {
  readonly renderer: THREE.WebGLRenderer
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera

  private readonly container: HTMLElement
  private readonly clock = new THREE.Clock()
  private readonly texture: THREE.CanvasTexture
  private readonly points: THREE.Points
  private readonly ground: THREE.Mesh
  private readonly ring: THREE.Mesh
  private readonly stars: THREE.Points
  private readonly rockets = new Float32Array(MAX_ROCKETS * 8)
  private readonly positions: Float32Array
  private readonly velocities: Float32Array
  private readonly colors: Float32Array
  private readonly lives: Float32Array
  private readonly tmp = new THREE.Vector3()
  private readonly camPos = new THREE.Vector3()
  private readonly camLook = new THREE.Vector3()
  private readonly focus = new THREE.Vector3(0, 18, 0)
  private readonly scratchColor = new THREE.Color()
  private readonly burstColor = new THREE.Color()
  private readonly innerColor = new THREE.Color()
  private readonly white = new THREE.Color(0xffffff)
  private readonly camUp = new THREE.Vector3(0, 1, 0)
  private frame = 0
  private palette: FireworksPalette
  private intensity: number
  private paused: boolean
  private running = false
  private spawnAcc = 0
  private particleCursor = 0
  private reducedMotion: boolean
  private lastCycleT = 0
  private heroArmed = false

  constructor(container: HTMLElement, options: FireworksEngineOptions = {}) {
    this.container = container
    this.palette = options.palette ?? 'night'
    this.intensity = options.intensity ?? 1
    this.paused = options.paused ?? false
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(SKY.dark.bg)
    this.scene.fog = new THREE.FogExp2(SKY.dark.fog, 0.012)

    const { width, height } = this.size()
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.08, 420)
    this.camera.position.set(0, 9.2, 14)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(this.renderer.domElement)

    this.texture = makeSparkTexture()
    this.positions = new Float32Array(MAX_PARTICLES * 3)
    this.velocities = new Float32Array(MAX_PARTICLES * 3)
    this.colors = new Float32Array(MAX_PARTICLES * 3)
    this.lives = new Float32Array(MAX_PARTICLES)

    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.lives[i] = -1
      this.positions[i * 3 + 1] = -40
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3))

    const material = new THREE.PointsMaterial({
      map: this.texture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      size: 0.4,
      sizeAttenuation: true,
      opacity: 0.95,
    })
    this.points = new THREE.Points(geometry, material)
    this.points.frustumCulled = false
    this.scene.add(this.points)

    this.ground = new THREE.Mesh(
      new THREE.CircleGeometry(110, 64),
      new THREE.MeshBasicMaterial({ color: SKY.dark.ground, transparent: true, opacity: 0.94 }),
    )
    this.ground.rotation.x = -Math.PI / 2
    this.scene.add(this.ground)

    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(18, 42, 64),
      new THREE.MeshBasicMaterial({ color: 0x0b1220, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
    )
    this.ring.rotation.x = -Math.PI / 2
    this.ring.position.y = 0.02
    this.scene.add(this.ring)

    this.stars = this.createStars()
    this.scene.add(this.stars)

    for (let i = 0; i < MAX_ROCKETS; i++) this.rockets[i * 8 + 6] = -1
    this.setSky(options.sky ?? 'dark')
  }

  setPalette(palette: FireworksPalette) {
    this.palette = palette
  }

  setIntensity(value: number) {
    this.intensity = Math.min(2, Math.max(0.35, value))
  }

  setPaused(paused: boolean) {
    this.paused = paused
  }

  setSky(sky: FireworksSky) {
    const theme = SKY[sky]
    this.scene.background = new THREE.Color(theme.bg)
    this.scene.fog = new THREE.FogExp2(theme.fog, 0.012)
    ;(this.ground.material as THREE.MeshBasicMaterial).color.setHex(theme.ground)
  }

  start() {
    if (this.running) return
    this.running = true
    this.clock.start()
    this.loop()
  }

  stop() {
    this.running = false
    if (this.frame) {
      cancelAnimationFrame(this.frame)
      this.frame = 0
    }
  }

  resize() {
    const { width, height } = this.size()
    if (width < 2 || height < 2) return
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  dispose() {
    this.stop()
    this.points.geometry.dispose()
    ;(this.points.material as THREE.PointsMaterial).dispose()
    this.stars.geometry.dispose()
    ;(this.stars.material as THREE.PointsMaterial).dispose()
    this.ground.geometry.dispose()
    ;(this.ground.material as THREE.MeshBasicMaterial).dispose()
    this.ring.geometry.dispose()
    ;(this.ring.material as THREE.MeshBasicMaterial).dispose()
    this.texture.dispose()
    this.renderer.dispose()
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement)
    }
  }

  private size() {
    return {
      width: this.container.clientWidth || 800,
      height: this.container.clientHeight || 450,
    }
  }

  private createStars() {
    const count = 520
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = 6 + Math.random() * 80
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x8aa4c8, size: 0.08, transparent: true, opacity: 0.55 }),
    )
  }

  private loop = () => {
    if (!this.running) return
    this.frame = requestAnimationFrame(this.loop)
    const dt = Math.min(this.clock.getDelta(), 0.033)
    if (!this.paused) {
      const duration = this.reducedMotion ? CYCLE * 1.7 : CYCLE
      const cycleT = (this.clock.elapsedTime % duration) / duration
      this.maybeLaunchHero(cycleT)
      this.spawn(dt, cycleT)
      this.stepRockets(dt)
      this.stepParticles(dt)
      this.stepCamera(cycleT)
      this.lastCycleT = cycleT
    }
    this.renderer.render(this.scene, this.camera)
  }

  private pickColor() {
    const list = PALETTES[this.palette]
    return this.scratchColor.setHex(list[Math.floor(Math.random() * list.length)] ?? 0xffffff)
  }

  private maybeLaunchHero(cycleT: number) {
    if (this.lastCycleT > cycleT) this.heroArmed = false
    if (!this.heroArmed && this.lastCycleT < 0.46 && cycleT >= 0.46) {
      this.heroArmed = true
      this.launchRocket(true)
    }
  }

  private spawn(dt: number, cycleT: number) {
    const motion = this.reducedMotion ? 0.4 : 1
    let rate = 0.55 * this.intensity * motion
    if (cycleT < 0.3) rate = 2.4 * this.intensity * motion
    else if (cycleT < 0.46) rate = 1.5 * this.intensity * motion
    else if (cycleT < 0.7) rate = 1.9 * this.intensity * motion
    else if (cycleT < 0.82) rate = 0
    else rate = 1.25 * this.intensity * motion

    this.spawnAcc += dt * rate
    while (this.spawnAcc >= 1) {
      this.spawnAcc -= 1
      this.launchRocket(false, cycleT)
    }
  }

  private launchRocket(hero: boolean, cycleT = 0) {
    let slot = -1
    for (let i = 0; i < MAX_ROCKETS; i++) {
      if (at(this.rockets, i * 8 + 6) < 0) {
        slot = i
        break
      }
    }
    if (slot < 0) return
    const o = slot * 8
    if (hero) {
      this.rockets[o] = 0.6
      this.rockets[o + 1] = 0.2
      this.rockets[o + 2] = 0.4
      this.rockets[o + 3] = 0.15
      this.rockets[o + 4] = 18.5
      this.rockets[o + 5] = -0.2
      this.rockets[o + 6] = 2
      this.rockets[o + 7] = 17.8
      return
    }
    const angle = Math.random() * Math.PI * 2
    const radius = 0.4 + Math.random() * 4.2
    this.rockets[o] = Math.cos(angle) * radius
    this.rockets[o + 1] = 0.2
    this.rockets[o + 2] = Math.sin(angle) * radius
    this.rockets[o + 3] = (Math.random() - 0.5) * 1.2
    this.rockets[o + 4] = 15.5 + Math.random() * 7
    this.rockets[o + 5] = (Math.random() - 0.5) * 1.2
    this.rockets[o + 6] = 1
    this.rockets[o + 7] = 13 + Math.random() * 7
    if (cycleT >= 0.48 && cycleT < 0.72) {
      const jitter = 0.9
      this.rockets[o] = this.focus.x + (Math.random() - 0.5) * jitter
      this.rockets[o + 1] = Math.max(0.2, this.focus.y - 6)
      this.rockets[o + 2] = this.focus.z + (Math.random() - 0.5) * jitter
      this.rockets[o + 3] = (Math.random() - 0.5) * 0.4
      this.rockets[o + 4] = 11 + Math.random() * 3
      this.rockets[o + 5] = (Math.random() - 0.5) * 0.4
      this.rockets[o + 7] = this.focus.y + (Math.random() - 0.4) * 1.4
    }
  }

  private stepRockets(dt: number) {
    for (let i = 0; i < MAX_ROCKETS; i++) {
      const o = i * 8
      const kind = at(this.rockets, o + 6)
      if (kind < 0) continue
      addAt(this.rockets, o, at(this.rockets, o + 3) * dt)
      addAt(this.rockets, o + 1, at(this.rockets, o + 4) * dt)
      addAt(this.rockets, o + 2, at(this.rockets, o + 5) * dt)
      addAt(this.rockets, o + 4, -10.4 * dt)
      this.emitTrail(at(this.rockets, o), at(this.rockets, o + 1), at(this.rockets, o + 2), this.pickColor())
      if (at(this.rockets, o + 1) >= at(this.rockets, o + 7) || at(this.rockets, o + 4) < 2.1) {
        const hero = kind > 1.5
        this.explode(at(this.rockets, o), at(this.rockets, o + 1), at(this.rockets, o + 2), hero)
        this.rockets[o + 6] = -1
      }
    }
  }

  private explode(x: number, y: number, z: number, hero: boolean) {
    if (hero || y > this.focus.y - 1) this.focus.set(x, y, z)
    this.burstColor.copy(this.pickColor())
    const shell = Math.floor((hero ? 220 : 110 + Math.random() * 70) * this.intensity)
    const speed = hero ? 9.8 : 7.2 + Math.random() * 1.8
    for (let n = 0; n < shell; n++) {
      this.spawnParticle(x, y, z, this.burstColor, speed * (0.92 + Math.random() * 0.16), 1.45 + Math.random() * 0.7)
    }
    this.innerColor.copy(this.burstColor).lerp(this.white, 0.62)
    const core = hero ? 36 : 16
    for (let n = 0; n < core; n++) {
      this.spawnParticle(x, y, z, this.innerColor, 1.6 + Math.random() * 2.2, 0.38)
    }
    const willow = hero ? 40 : 12
    for (let n = 0; n < willow; n++) {
      this.spawnParticle(x, y, z, this.burstColor, 3.2 + Math.random() * 2.4, 1.6 + Math.random() * 0.6)
    }
  }

  private emitTrail(x: number, y: number, z: number, color: THREE.Color) {
    this.spawnParticle(x, y, z, color, 0.18 + Math.random() * 0.28, 0.18)
  }

  private spawnParticle(x: number, y: number, z: number, color: THREE.Color, speed: number, life: number) {
    const index = this.particleCursor
    this.particleCursor = (this.particleCursor + 1) % MAX_PARTICLES
    randomOnSphere(this.tmp).multiplyScalar(speed)
    const i3 = index * 3
    this.positions[i3] = x
    this.positions[i3 + 1] = y
    this.positions[i3 + 2] = z
    this.velocities[i3] = this.tmp.x
    this.velocities[i3 + 1] = this.tmp.y
    this.velocities[i3 + 2] = this.tmp.z
    this.colors[i3] = color.r
    this.colors[i3 + 1] = color.g
    this.colors[i3 + 2] = color.b
    this.lives[index] = life
  }

  private stepParticles(dt: number) {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (at(this.lives, i) <= 0) continue
      addAt(this.lives, i, -dt)
      const i3 = i * 3
      addAt(this.velocities, i3 + 1, -6.6 * dt)
      mulAt(this.velocities, i3, 0.978)
      mulAt(this.velocities, i3 + 1, 0.978)
      mulAt(this.velocities, i3 + 2, 0.978)
      addAt(this.positions, i3, at(this.velocities, i3) * dt)
      addAt(this.positions, i3 + 1, at(this.velocities, i3 + 1) * dt)
      addAt(this.positions, i3 + 2, at(this.velocities, i3 + 2) * dt)
      mulAt(this.colors, i3, 0.986)
      mulAt(this.colors, i3 + 1, 0.986)
      mulAt(this.colors, i3 + 2, 0.986)
      if (at(this.lives, i) <= 0) this.positions[i3 + 1] = -50
    }
    const geo = this.points.geometry
    ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(geo.attributes.color as THREE.BufferAttribute).needsUpdate = true
  }

  private stepCamera(cycleT: number) {
    const shot = this.sampleShot(cycleT)
    this.camera.fov = shot.fov
    this.camera.updateProjectionMatrix()
    this.camUp.set(Math.sin(shot.roll), Math.cos(shot.roll), 0)
    this.camera.up.copy(this.camUp)
    this.camera.position.copy(shot.pos)
    this.camera.lookAt(shot.look)
    const dist = this.camera.position.distanceTo(shot.look)
    ;(this.points.material as THREE.PointsMaterial).size = mix(0.16, 0.55, clamp01((dist - 1.4) / 14))
  }

  private sampleShot(t: number) {
    const hero = this.focus
    let theta = 0.2
    let radius = 14
    let height = 9.2
    let lookY = 16
    let lookX = 0
    let lookZ = 0
    let fov = 34
    let roll = 0
    let aroundHero = false

    if (t < 0.3) {
      const u = smootherstep(t / 0.3)
      theta = mix(-0.32, 0.3, u)
      radius = mix(14, 11, u)
      height = mix(9.6, 8.2, u)
      lookY = mix(15.2, 16.6, u)
      fov = mix(34, 30, u)
    } else if (t < 0.48) {
      const u = easeInOutCubic((t - 0.3) / 0.18)
      theta = mix(0.3, 0.05, u)
      radius = mix(11, 4.4, u)
      height = mix(8.2, 0.7, u)
      lookY = mix(16.6, 18.2, u)
      fov = mix(30, 28, u)
      roll = mix(0, -0.04, u)
    } else if (t < 0.82) {
      aroundHero = true
      const u = clamp01((t - 0.48) / 0.34)
      const spin = this.reducedMotion ? easeInCubic(u) : easeInExpo(u)
      const dolly = this.reducedMotion ? easeInOutCubic(u) : easeInCubic(u)
      theta = 0.05 + spin * Math.PI * (this.reducedMotion ? 1.15 : 2.35)
      radius = mix(4.4, 0.85, dolly)
      height = mix(0.7, hero.y + 0.15, easeInOutCubic(u))
      lookX = hero.x
      lookY = hero.y
      lookZ = hero.z
      fov = mix(28, 20, dolly)
      roll = Math.sin(spin * Math.PI) * (this.reducedMotion ? 0.06 : 0.22)
    } else {
      const u = easeOutCubic((t - 0.82) / 0.18)
      aroundHero = u < 0.35
      theta = mix(0.05 + Math.PI * 2.35, Math.PI * 2 - 0.32, u)
      radius = mix(0.85, 14, u)
      height = mix(hero.y + 0.15, 9.6, u)
      lookX = mix(hero.x, 0, u)
      lookY = mix(hero.y, 15.2, u)
      lookZ = mix(hero.z, 0, u)
      fov = mix(20, 34, u)
      roll = mix(0.04, 0, u)
    }

    if (aroundHero) {
      this.camPos.set(
        hero.x + Math.sin(theta) * radius,
        height,
        hero.z + Math.cos(theta) * radius,
      )
    } else {
      this.camPos.set(Math.sin(theta) * radius, height, Math.cos(theta) * radius)
    }
    this.camLook.set(lookX, lookY, lookZ)
    return { pos: this.camPos, look: this.camLook, fov, roll }
  }
}
