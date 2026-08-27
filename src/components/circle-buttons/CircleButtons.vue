<script setup lang="ts">
import './circle-buttons.css'
import { computed } from 'vue'

export type CircleButtonVariant = 'play' | 'plus' | 'mail'
export type CircleButtonMode = 'light' | 'dark'

export interface CircleButtonsProps {
  /** 按钮变体：play（暗色玻璃）、plus（琥珀渐变）、mail（点阵边框） */
  variant?: CircleButtonVariant
  /** 主题模式 */
  mode?: CircleButtonMode
  /** 色相偏移（deg），范围 -180 ~ 180 */
  hue?: number
  /** 饱和度倍数，范围 0 ~ 2 */
  saturation?: number
  /** 亮度倍数，范围 0.35 ~ 1.65 */
  brightness?: number
  /** 可访问性标签 */
  ariaLabel?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<CircleButtonsProps>(), {
  variant: 'play',
  mode: 'dark',
  hue: 0,
  saturation: 1,
  brightness: 1,
  ariaLabel: undefined,
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const LABELS: Record<CircleButtonVariant, string> = {
  play: '播放',
  plus: '添加',
  mail: '发送邮件',
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const safeVariant = computed<CircleButtonVariant>(() =>
  props.variant === 'plus' || props.variant === 'mail' ? props.variant : 'play',
)
const safeMode = computed<CircleButtonMode>(() => (props.mode === 'light' ? 'light' : 'dark'))

const stageStyle = computed(() => ({
  '--circle-button-hue': `${clamp(props.hue, -180, 180)}deg`,
  '--circle-button-saturation': clamp(props.saturation, 0, 2),
  '--circle-button-brightness': clamp(props.brightness, 0.35, 1.65),
}))

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <div
    class="circle-buttons"
    :class="[`circle-buttons--${safeVariant}`, `circle-buttons--${safeMode}`]"
    :data-mode="safeMode"
    :data-variant="safeVariant"
    :style="stageStyle"
  >
    <div class="circle-buttons__atmosphere" aria-hidden="true" />
    <button
      class="circle-button"
      :type="type"
      :aria-label="ariaLabel ?? LABELS[safeVariant]"
      :disabled="disabled"
      @click="handleClick"
    >
      <span class="circle-button__aura" aria-hidden="true" />
      <span class="circle-button__rim" aria-hidden="true" />
      <span class="circle-button__face" aria-hidden="true" />
      <span class="circle-button__details" aria-hidden="true">
        <i /><i /><i /><i />
        <b /><b /><b /><b />
      </span>
      <span class="circle-button__icon">
        <!-- Play 图标 -->
        <svg v-if="safeVariant === 'play'" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M11.75 8.7c0-1.28 1.4-2.08 2.5-1.43l12 7.3a1.66 1.66 0 0 1 0 2.86l-12 7.3a1.66 1.66 0 0 1-2.5-1.43V8.7Z"
          />
        </svg>
        <!-- Plus 图标 -->
        <svg v-else-if="safeVariant === 'plus'" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 7v18M7 16h18" />
        </svg>
        <!-- Mail 图标 -->
        <svg v-else viewBox="0 0 32 32" aria-hidden="true">
          <rect x="5.25" y="7.5" width="21.5" height="17" rx="3.25" />
          <path d="m7.25 10 7.35 5.72a2.26 2.26 0 0 0 2.8 0L24.75 10" />
        </svg>
      </span>
    </button>
  </div>
</template>
