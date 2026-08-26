<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { parseSkillMarkdown } from '@/utils/skillParser'

interface Props {
  content: string
  showMeta?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showMeta: true,
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const parsed = computed(() => parseSkillMarkdown(props.content))

const rendered = computed(() => md.render(parsed.value.content))

const metaEntries = computed(() => {
  const entries: Array<{ label: string; value: string }> = []
  const m = parsed.value.meta
  if (m.name) entries.push({ label: '名称', value: m.name })
  if (m.description) entries.push({ label: '描述', value: m.description })
  if (m.version) entries.push({ label: '版本', value: String(m.version) })
  if (m.author) entries.push({ label: '作者', value: String(m.author) })
  if (m.tags) {
    const tags = Array.isArray(m.tags) ? m.tags : String(m.tags).split(',')
    entries.push({ label: '标签', value: tags.join(', ') })
  }
  return entries
})
</script>

<template>
  <div class="skill-doc">
    <div v-if="showMeta && metaEntries.length" class="skill-meta">
      <div v-for="entry in metaEntries" :key="entry.label" class="meta-row">
        <span class="meta-label">{{ entry.label }}</span>
        <span class="meta-value">{{ entry.value }}</span>
      </div>
    </div>
    <div class="skill-content" v-html="rendered"></div>
  </div>
</template>

<style scoped>
.skill-doc {
  line-height: 1.8;
}

.skill-meta {
  background: linear-gradient(135deg, #f6f8fa 0%, #eef1f5 100%);
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.meta-row {
  display: flex;
  align-items: baseline;
  padding: 0.5rem 0;
}

.meta-row:not(:last-child) {
  border-bottom: 1px solid #e1e4e8;
}

.meta-label {
  font-weight: 600;
  color: #24292e;
  min-width: 80px;
  margin-right: 1rem;
}

.meta-value {
  color: #586069;
  flex: 1;
}

.skill-content {
  padding: 0 1rem;
}

.skill-content :deep(h1) {
  font-size: 2rem;
  margin: 2rem 0 1rem;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 0.5rem;
}

.skill-doc :deep(h2) {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3rem;
}

.skill-doc :deep(h3) {
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem;
}

.skill-doc :deep(p) {
  margin: 1rem 0;
}

.skill-doc :deep(ul),
.skill-doc :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.skill-doc :deep(li) {
  margin: 0.5rem 0;
}

.skill-doc :deep(code) {
  background: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.skill-doc :deep(pre) {
  background: #282c34;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1rem 0;
}

.skill-doc :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #abb2bf;
}

.skill-doc :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.skill-doc :deep(th),
.skill-doc :deep(td) {
  border: 1px solid #eaecef;
  padding: 0.75rem;
  text-align: left;
}

.skill-doc :deep(th) {
  background: #f6f8fa;
  font-weight: 600;
}

.skill-doc :deep(blockquote) {
  border-left: 4px solid #42b883;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #666;
}

.skill-doc :deep(a) {
  color: #42b883;
  text-decoration: none;
}

.skill-doc :deep(a:hover) {
  text-decoration: underline;
}

.skill-doc :deep(hr) {
  border: none;
  border-top: 1px solid #eaecef;
  margin: 2rem 0;
}

.skill-doc :deep(input[type="checkbox"]) {
  margin-right: 0.5rem;
}
</style>
