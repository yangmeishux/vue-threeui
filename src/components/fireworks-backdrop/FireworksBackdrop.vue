<script setup lang="ts">
import './fireworks-backdrop.css'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { FireworksEngine, type FireworksPalette } from './fireworks-engine'

export type { FireworksPalette }
export type FireworksBackdropMode = 'dark' | 'light'

export interface FireworksBackdropProps {
  /** 配色：夜空冷色、节庆撞色、金色暖色 */
  palette?: FireworksPalette
  /** 兼容文档站变体选择，等同 palette */
  variant?: FireworksPalette
  /** 天空基调 */
  mode?: FireworksBackdropMode
  /** 燃放密度，0.35 ~ 2 */
  intensity?: number
  /** 暂停镜头与粒子 */
  paused?: boolean
  /** 色相偏移（deg），-180 ~ 180 */
  hue?: number
  /** 饱和度倍数，0 ~ 2 */
  saturation?: number
  /** 亮度倍数，0.35 ~ 1.65 */
  brightness?: number
}

const props = withDefaults(defineProps<FireworksBackdropProps>(), {
  palette: undefined,
  variant: undefined,
  mode: 'dark',
  intensity: 1,
  paused: false,
  hue: 0,
  saturation: 1,
  brightness: 1,
})

const rootRef = ref<HTMLDivElement | null>(null)
let engine: FireworksEngine | null = null
let resizeObserver: ResizeObserver | null = null
let visibilityObserver: IntersectionObserver | null = null
const offscreen = ref(false)

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const safePalette = computed<FireworksPalette>(() => {
  const value = props.palette ?? props.variant ?? 'night'
  return value === 'festival' || value === 'gold' ? value : 'night'
})

const stageStyle = computed(() => ({
  filter: `hue-rotate(${clamp(props.hue, -180, 180)}deg) saturate(${clamp(props.saturation, 0, 2)}) brightness(${clamp(props.brightness, 0.35, 1.65)})`,
}))

function syncEngine() {
  if (!engine) return
  engine.setPalette(safePalette.value)
  engine.setIntensity(props.intensity)
  engine.setSky(props.mode === 'light' ? 'light' : 'dark')
  engine.setPaused(props.paused || offscreen.value)
}

onMounted(() => {
  if (!rootRef.value) return
  engine = new FireworksEngine(rootRef.value, {
    palette: safePalette.value,
    intensity: props.intensity,
    paused: props.paused,
    sky: props.mode === 'light' ? 'light' : 'dark',
  })
  engine.start()

  resizeObserver = new ResizeObserver(() => engine?.resize())
  resizeObserver.observe(rootRef.value)

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      const visible = Boolean(entry?.isIntersecting) || (entry?.intersectionRatio ?? 0) > 0
      const box = rootRef.value?.getBoundingClientRect()
      const onStage = (box?.height ?? 0) > 80 && (box?.width ?? 0) > 80
      offscreen.value = !(visible || onStage)
      syncEngine()
    },
    { threshold: [0, 0.01, 0.1], rootMargin: '120px' },
  )
  visibilityObserver.observe(rootRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  engine?.dispose()
  engine = null
})

watch([safePalette, () => props.intensity, () => props.paused, () => props.mode], syncEngine)
</script>

<template>
  <div
    ref="rootRef"
    class="fireworks-backdrop"
    :class="`fireworks-backdrop--${mode}`"
    :style="stageStyle"
    aria-hidden="true"
  />
</template>
