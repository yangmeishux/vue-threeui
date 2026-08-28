<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('markdown', markdown)

import 'highlight.js/styles/atom-one-dark.css'

interface Props {
  code: string
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue',
})

const codeRef = ref<HTMLElement | null>(null)
const copied = ref(false)

function highlight() {
  if (!codeRef.value) return
  const lang = props.language
  if (hljs.getLanguage(lang)) {
    codeRef.value.innerHTML = hljs.highlight(props.code, { language: lang }).value
  } else {
    codeRef.value.textContent = props.code
  }
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback
    const textarea = document.createElement('textarea')
    textarea.value = props.code
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

onMounted(highlight)
watch(() => [props.code, props.language], highlight)
</script>

<template>
  <div class="code-block-wrapper">
    <div class="code-block-header">
      <span class="code-lang">{{ language }}</span>
      <button class="copy-btn" :class="{ copied }" @click="copyCode">
        {{ copied ? '✓ 已复制' : '复制' }}
      </button>
    </div>
    <pre class="code-block"><code ref="codeRef" class="hljs" :class="`language-${language}`">{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background: #282c34;
  margin: 1rem 0;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #21252b;
  border-bottom: 1px solid #181a1f;
}

.code-lang {
  font-size: 0.8rem;
  color: #abb2bf;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.copy-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  color: #abb2bf;
  background: transparent;
  border: 1px solid #3e4451;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #3e4451;
  color: #fff;
}

.copy-btn.copied {
  color: #98c379;
  border-color: #98c379;
}

.code-block {
  margin: 0;
  padding: 1rem 1.5rem;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #abb2bf;
}

.code-block code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  color: #abb2bf;
  background: transparent;
}
</style>
