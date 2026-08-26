import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import * as THREE from 'three'

interface UseThreeRendererOptions {
  width?: number
  height?: number
  backgroundColor?: number
}

export function useThreeRenderer(options: UseThreeRendererOptions = {}) {
  const containerRef: Ref<HTMLDivElement | null> = ref(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const animationFrameId = ref<number | null>(null)

  const {
    width = 800,
    height = 600,
    backgroundColor = 0x000000,
  } = options

  function initRenderer() {
    if (!containerRef.value) return

    // 创建场景
    scene.value = new THREE.Scene()
    scene.value.background = new THREE.Color(backgroundColor)

    // 创建相机
    camera.value = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.value.position.z = 5

    // 创建渲染器
    renderer.value = new THREE.WebGLRenderer({ antialias: true })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(window.devicePixelRatio)
    containerRef.value.appendChild(renderer.value.domElement)
  }

  function render() {
    if (!renderer.value || !scene.value || !camera.value) return
    renderer.value.render(scene.value, camera.value)
  }

  function animate(callback?: () => void) {
    function loop() {
      if (callback) callback()
      render()
      animationFrameId.value = requestAnimationFrame(loop)
    }
    loop()
  }

  function stopAnimation() {
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }
  }

  function handleResize(newWidth: number, newHeight: number) {
    if (!camera.value || !renderer.value) return
    camera.value.aspect = newWidth / newHeight
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(newWidth, newHeight)
  }

  function dispose() {
    stopAnimation()
    if (renderer.value) {
      renderer.value.dispose()
      if (containerRef.value && renderer.value.domElement.parentNode === containerRef.value) {
        containerRef.value.removeChild(renderer.value.domElement)
      }
    }
    renderer.value = null
    scene.value = null
    camera.value = null
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    containerRef,
    renderer,
    scene,
    camera,
    initRenderer,
    render,
    animate,
    stopAnimation,
    handleResize,
    dispose,
  }
}
