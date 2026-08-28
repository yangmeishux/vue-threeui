<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CircleButtons } from '@/components'
import type { CircleButtonMode, CircleButtonVariant } from '@/components'
import ComponentShowcase from '@/docs/components/ComponentShowcase.vue'
import { getComponentDoc } from '@/docs/showcase/registry'

const route = useRoute()
const componentId = computed(() => String(route.params.id ?? ''))
const doc = computed(() => getComponentDoc(componentId.value))

const skillModules = import.meta.glob('@/components/**/SKILL.md', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const skillContent = computed(() => {
  const match = Object.entries(skillModules).find(([path]) =>
    path.includes(`/components/${componentId.value}/SKILL.md`),
  )
  return match?.[1] ?? ''
})

const variant = ref<CircleButtonVariant>('play')
const mode = ref<CircleButtonMode>('dark')
const hue = ref(0)
const saturation = ref(1)
const brightness = ref(1)

function resetPlayground() {
  variant.value = 'play'
  mode.value = 'dark'
  hue.value = 0
  saturation.value = 1
  brightness.value = 1
}

function asVariant(value: string): CircleButtonVariant {
  return value === 'plus' || value === 'mail' ? value : 'play'
}
</script>

<template>
  <div v-if="!doc" class="missing">
    <p>未找到组件。</p>
    <router-link to="/browse">Back to Browse</router-link>
  </div>

  <ComponentShowcase
    v-else
    :doc="doc"
    :skill-content="skillContent"
    :variant="variant"
    :mode="mode"
    :hue="hue"
    :saturation="saturation"
    :brightness="brightness"
    @update:variant="variant = asVariant($event)"
    @update:mode="mode = $event"
    @update:hue="hue = $event"
    @update:saturation="saturation = $event"
    @update:brightness="brightness = $event"
    @reset="resetPlayground"
  >
    <template #preview>
      <CircleButtons
        v-if="doc.id === 'circle-buttons'"
        class="showcase-preview"
        :variant="variant"
        :mode="mode"
        :hue="hue"
        :saturation="saturation"
        :brightness="brightness"
      />
    </template>
  </ComponentShowcase>
</template>

<style scoped>
.missing {
  max-width: 720px;
  margin: 0 auto;
  padding: 80px 20px;
  color: var(--muted);
  font-size: 13px;
}

.missing a {
  color: var(--text);
}
</style>
