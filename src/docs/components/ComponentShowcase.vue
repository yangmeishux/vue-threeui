<script setup lang="ts">
import { computed, ref } from 'vue'
import CodeBlock from '@/docs/components/CodeBlock.vue'
import type { ComponentDoc } from '@/docs/showcase/types'
import { getAdjacentDocs } from '@/docs/showcase/registry'

const props = defineProps<{
  doc: ComponentDoc
  skillContent: string
  variant: string
  mode: 'dark' | 'light'
  hue: number
  saturation: number
  brightness: number
}>()

const emit = defineEmits<{
  'update:variant': [value: string]
  'update:mode': [value: 'dark' | 'light']
  'update:hue': [value: number]
  'update:saturation': [value: number]
  'update:brightness': [value: number]
  reset: []
}>()

const previewHeight = ref(420)
const copiedPrompt = ref(false)
const docTab = ref<'usage' | 'code' | 'skill'>('usage')
const packageManager = ref<'npm' | 'pnpm' | 'bun' | 'yarn'>('npm')

const adjacent = computed(() => getAdjacentDocs(props.doc.id))

const installCommands: Record<string, string> = {
  npm: 'npm install vue-threeui',
  pnpm: 'pnpm add vue-threeui',
  bun: 'bun add vue-threeui',
  yarn: 'yarn add vue-threeui',
}

const usageCode = computed(() => {
  const name = props.doc.importName
  const lines = [
    '<script setup lang="ts">',
    `import { ${name} } from 'vue-threeui'`,
    '',
    `function handleClick() {`,
    `  console.log('clicked')`,
    `}`,
    '<\/script>',
    '',
    '<template>',
    `  <${name}`,
    `    variant="${props.variant}"`,
    `    mode="${props.mode}"`,
  ]
  if (props.doc.colorTune) {
    lines.push(`    :hue="${props.hue}"`)
    lines.push(`    :saturation="${props.saturation}"`)
    lines.push(`    :brightness="${props.brightness}"`)
  }
  lines.push('    @click="handleClick"', `  />`, '</template>')
  return lines.join('\n')
})

const promptText = computed(() => {
  return [
    `在项目中使用 vue-threeui 的 ${props.doc.importName} 组件（${props.doc.name} / ${props.doc.title}）。`,
    '',
    props.doc.lede,
    '',
    '示例：',
    usageCode.value,
    '',
    '--- Skill.md ---',
    props.skillContent,
  ].join('\n')
})

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

async function copyPrompt() {
  await copyText(promptText.value)
  copiedPrompt.value = true
  window.setTimeout(() => {
    copiedPrompt.value = false
  }, 2000)
}

function resizePreview(delta: number) {
  previewHeight.value = Math.min(720, Math.max(220, previewHeight.value + delta))
}
</script>

<template>
  <article class="showcase">
    <header class="showcase-head">
      <div class="showcase-head__row">
        <h1>
          {{ doc.name }}
          <small>{{ doc.title }}</small>
        </h1>
        <button type="button" class="copy-prompt" @click="copyPrompt">
          {{ copiedPrompt ? '已复制' : '复制提示词' }}
        </button>
      </div>
      <p class="lede">{{ doc.lede }}</p>
      <div class="meta-row">
        <router-link
          v-for="tag in doc.tags"
          :key="tag"
          class="tag"
          :to="{ path: '/browse' }"
        >
          {{ tag }}
        </router-link>
      </div>
    </header>

    <div class="preview-layout">
      <div class="stage-wrap">
        <div class="stage" :class="`is-${mode}`" :style="{ height: `${previewHeight}px` }">
          <slot name="preview" />
          <div class="stage-bar">
            <button type="button" title="降低预览高度" @click="resizePreview(-100)">−</button>
            <button type="button" title="增加预览高度" @click="resizePreview(100)">+</button>
            <button type="button" title="重置预览高度" @click="previewHeight = 420">↺</button>
          </div>
        </div>
      </div>

      <aside class="controls">
        <div v-if="doc.variants.length" class="variants" role="radiogroup" aria-label="变体">
          <label v-for="item in doc.variants" :key="item.id" class="variant">
            <input
              type="radio"
              name="variant"
              :value="item.id"
              :checked="variant === item.id"
              @change="emit('update:variant', item.id)"
            >
            <span class="variant__label">
              {{ item.label }}
              <small>{{ item.id }}</small>
            </span>
            <span class="variant__desc">{{ item.description }}</span>
          </label>
        </div>

        <button type="button" class="reset" @click="emit('reset')">重置属性</button>

        <div class="mode-switch" role="group" aria-label="主题">
          <button type="button" :class="{ 'is-active': mode === 'dark' }" @click="emit('update:mode', 'dark')">深色</button>
          <button type="button" :class="{ 'is-active': mode === 'light' }" @click="emit('update:mode', 'light')">浅色</button>
        </div>

        <div v-if="doc.colorTune" class="sliders">
          <label>
            <span>色相 <em>{{ hue }}</em></span>
            <input type="range" min="-180" max="180" step="1" :value="hue" @input="emit('update:hue', Number(($event.target as HTMLInputElement).value))">
          </label>
          <label>
            <span>饱和度 <em>{{ saturation.toFixed(2) }}</em></span>
            <input type="range" min="0" max="2" step="0.01" :value="saturation" @input="emit('update:saturation', Number(($event.target as HTMLInputElement).value))">
          </label>
          <label>
            <span>亮度 <em>{{ brightness.toFixed(2) }}</em></span>
            <input type="range" min="0.35" max="1.65" step="0.01" :value="brightness" @input="emit('update:brightness', Number(($event.target as HTMLInputElement).value))">
          </label>
        </div>
      </aside>
    </div>

    <div class="doc-tabs" role="tablist">
      <button type="button" role="tab" :aria-selected="docTab === 'usage'" :class="{ 'is-active': docTab === 'usage' }" @click="docTab = 'usage'">调用方式</button>
      <button type="button" role="tab" :aria-selected="docTab === 'code'" :class="{ 'is-active': docTab === 'code' }" @click="docTab = 'code'">代码</button>
      <button type="button" role="tab" :aria-selected="docTab === 'skill'" :class="{ 'is-active': docTab === 'skill' }" @click="docTab = 'skill'">Skill.md</button>
    </div>

    <section v-if="docTab === 'usage'" class="doc-panel">
      <h2>调用方式</h2>
      <CodeBlock :code="usageCode" language="vue" />
      <h2>安装</h2>
      <div class="pkg-tabs">
        <button v-for="mgr in (['npm', 'pnpm', 'bun', 'yarn'] as const)" :key="mgr" type="button" :class="{ 'is-active': packageManager === mgr }" @click="packageManager = mgr">
          {{ mgr }}
        </button>
      </div>
      <CodeBlock :code="installCommands[packageManager]" language="bash" />
      <p class="hint">请从库的入口导入：</p>
      <CodeBlock :code="`import { ${doc.importName} } from 'vue-threeui'`" language="typescript" />
    </section>

    <section v-else-if="docTab === 'code'" class="doc-panel">
      <h2>代码</h2>
      <CodeBlock :code="usageCode" language="vue" />
    </section>

    <section v-else class="doc-panel">
      <h2>Skill.md</h2>
      <CodeBlock :code="skillContent" language="markdown" />
    </section>

    <section class="doc-panel">
      <h2>属性</h2>
      <table class="props-table">
        <thead>
          <tr>
            <th>属性</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in doc.props" :key="prop.name">
            <td><code>{{ prop.name }}</code></td>
            <td><code>{{ prop.type }}</code></td>
            <td><code>{{ prop.default }}</code></td>
            <td>{{ prop.description }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="doc.events.length" class="doc-panel">
      <h2>事件</h2>
      <table class="props-table">
        <thead>
          <tr>
            <th>事件名</th>
            <th>参数</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in doc.events" :key="event.name">
            <td><code>{{ event.name }}</code></td>
            <td><code>{{ event.params }}</code></td>
            <td>{{ event.description }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <nav class="pager" aria-label="相邻组件">
      <router-link v-if="adjacent.prev" class="pager__link" :to="adjacent.prev.path">
        <span>上一个</span>
        <strong>{{ adjacent.prev.name }}</strong>
      </router-link>
      <span v-else class="pager__link is-disabled">
        <span>上一个</span>
        <strong>—</strong>
      </span>
      <router-link v-if="adjacent.next" class="pager__link pager__link--next" :to="adjacent.next.path">
        <span>下一个</span>
        <strong>{{ adjacent.next.name }}</strong>
      </router-link>
      <span v-else class="pager__link pager__link--next is-disabled">
        <span>下一个</span>
        <strong>—</strong>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.showcase {
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 20px 80px;
}

.showcase-head__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.showcase-head h1 {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.04em;
}

.showcase-head h1 small {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
}

.copy-prompt {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: #f7f8f8;
  color: #050608;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.lede {
  margin-top: 10px;
  max-width: 720px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.65;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tag {
  padding: 4px 8px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  color: var(--muted);
  font-size: 11px;
  text-decoration: none;
}

.tag:hover {
  color: var(--text);
}

.preview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  margin: 22px 0 28px;
}

.stage {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
}

.stage.is-dark {
  background: #050608;
}

.stage.is-light {
  background: #f4f7fb;
}

.stage :deep(.circle-buttons),
.stage :deep(.showcase-preview) {
  width: 100%;
  height: 100%;
  min-height: 100%;
}

.stage-bar {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgba(10, 11, 13, 0.88);
}

.stage-bar button {
  width: 28px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.variant {
  display: grid;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}

.variant input {
  position: absolute;
  opacity: 0;
}

.variant__label {
  font-size: 13px;
  color: var(--muted);
}

.variant__label small {
  margin-left: 6px;
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 11px;
}

.variant:has(input:checked) .variant__label {
  color: var(--text);
}

.variant__desc {
  color: var(--faint);
  font-size: 11px;
  line-height: 1.5;
}

.reset {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-size: 11px;
  cursor: pointer;
}

.reset:hover {
  color: var(--text);
}

.mode-switch {
  display: flex;
  width: fit-content;
  padding: 3px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
}

.mode-switch button {
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.mode-switch button.is-active {
  background: var(--text);
  color: var(--bg);
}

.sliders {
  display: grid;
  gap: 12px;
}

.sliders label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 11px;
}

.sliders em {
  float: right;
  font-style: normal;
  color: var(--text);
}

.sliders input[type='range'] {
  width: 100%;
  accent-color: var(--text);
}

.doc-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--line);
}

.doc-tabs button {
  padding: 10px 12px;
  margin-bottom: -1px;
  border: 0;
  border-bottom: 1px solid transparent;
  background: none;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.doc-tabs button.is-active {
  color: var(--text);
  border-bottom-color: var(--text);
}

.doc-panel {
  padding-top: 20px;
}

.doc-panel h2 {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
}

.pkg-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.pkg-tabs button {
  padding: 6px 10px;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.pkg-tabs button.is-active {
  color: var(--text);
  border-color: var(--text);
}

.hint {
  margin: 8px 0;
  color: var(--muted);
  font-size: 12px;
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.props-table th,
.props-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.props-table th {
  color: var(--muted);
  font-weight: 500;
}

.props-table code {
  font-family: inherit;
  color: var(--text);
}

.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 36px;
}

.pager__link {
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
}

.pager__link span {
  color: var(--faint);
  font-size: 11px;
}

.pager__link strong {
  font-size: 13px;
  font-weight: 500;
}

.pager__link--next {
  text-align: right;
}

.pager__link.is-disabled {
  opacity: 0.4;
}

@media (max-width: 900px) {
  .preview-layout {
    grid-template-columns: 1fr;
  }

  .showcase-head__row {
    flex-direction: column;
  }
}
</style>
