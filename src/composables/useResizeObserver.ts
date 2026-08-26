import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useResizeObserver(
  targetRef: Ref<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void
) {
  const isSupported = typeof ResizeObserver !== 'undefined'
  const observer = ref<ResizeObserver | null>(null)

  function cleanup() {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  onMounted(() => {
    if (!isSupported || !targetRef.value) return

    observer.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        callback(entry)
      }
    })

    observer.value.observe(targetRef.value)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isSupported,
    cleanup,
  }
}
