<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CircleButtons } from '@/components'
import type { CircleButtonVariant, CircleButtonMode } from '@/components'
import CodeBlock from '@/docs/components/CodeBlock.vue'
import SkillDoc from '@/docs/components/SkillDoc.vue'

const route = useRoute()
const componentId = computed(() => route.params.id as string)

// 组件配置
const variant = ref<CircleButtonVariant>('play')
const mode = ref<CircleButtonMode>('dark')
const activeTab = ref<'preview' | 'usage' | 'skill'>('preview')

// SKILL.md 内容
const skillContent = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/src/components/circle-buttons/SKILL.md')
    skillContent.value = await response.text()
  } catch (error) {
    console.error('加载 SKILL.md 失败:', error)
  }
})

// 使用示例代码
const usageCode = computed(() => {
  return [
    '<script setup lang="ts">',
    "import { CircleButtons } from 'vue-threeui'",
    "import type { CircleButtonVariant, CircleButtonMode } from 'vue-threeui'",
    '',
    `const variant: CircleButtonVariant = '${variant.value}'`,
    `const mode: CircleButtonMode = '${mode.value}'`,
    '',
    'function handleClick() {',
    "  console.log('按钮被点击')",
    '}',
    '<\/script>',
    '',
    '<template>',
    '  <CircleButtons',
    '    :variant="variant"',
    '    :mode="mode"',
    '    @click="handleClick"',
    '  />',
    '</template>',
  ].join('\n')
})

// Props 文档
const propsDoc = [
  { name: 'variant', type: "'play' | 'plus' | 'mail'", default: "'play'", description: '按钮风格' },
  { name: 'mode', type: "'dark' | 'light'", default: "'dark'", description: '主题模式' },
  { name: 'ariaLabel', type: 'string', default: '-', description: '无障碍标签' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用' },
]

// 事件文档
const eventsDoc = [
  { name: 'click', params: 'MouseEvent', description: '点击事件' },
]

function handleClick() {
  console.log('按钮被点击！')
}
</script>

<template>
  <div class="component-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <h1>圆形按钮 CircleButtons</h1>
      <p class="description">三种风格的圆形图标按钮，包含暗色玻璃、琥珀渐变、点阵边框效果</p>
    </header>

    <!-- Tab 切换 -->
    <div class="tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'preview' }]"
        @click="activeTab = 'preview'"
      >
        预览
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'usage' }]"
        @click="activeTab = 'usage'"
      >
        调用方式
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'skill' }]"
        @click="activeTab = 'skill'"
      >
        Skill.md
      </button>
    </div>

    <!-- 预览 Tab -->
    <div v-if="activeTab === 'preview'" class="tab-content">
      <section class="preview-section">
        <h2>实时预览</h2>
        <div class="controls">
          <div class="control-group">
            <label>变体：</label>
            <select v-model="variant">
              <option value="play">Play（暗色玻璃）</option>
              <option value="plus">Plus（琥珀渐变）</option>
              <option value="mail">Mail（点阵边框）</option>
            </select>
          </div>
          <div class="control-group">
            <label>主题：</label>
            <select v-model="mode">
              <option value="dark">深色</option>
              <option value="light">浅色</option>
            </select>
          </div>
        </div>
        <div class="preview-container" :class="`theme-${mode}`">
          <CircleButtons :variant="variant" :mode="mode" @click="handleClick" />
        </div>
      </section>

      <section class="props-section">
        <h2>Props</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>属性名</th>
              <th>类型</th>
              <th>默认值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in propsDoc" :key="prop.name">
              <td><code>{{ prop.name }}</code></td>
              <td><code>{{ prop.type }}</code></td>
              <td><code>{{ prop.default }}</code></td>
              <td>{{ prop.description }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="events-section">
        <h2>Events</h2>
        <table class="props-table">
          <thead>
            <tr>
              <th>事件名</th>
              <th>参数</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in eventsDoc" :key="event.name">
              <td><code>{{ event.name }}</code></td>
              <td><code>{{ event.params }}</code></td>
              <td>{{ event.description }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- 调用方式 Tab -->
    <div v-if="activeTab === 'usage'" class="tab-content">
      <section class="usage-section">
        <h2>使用示例</h2>
        <CodeBlock :code="usageCode" language="vue" />
      </section>

      <section class="install-section">
        <h2>安装</h2>
        <CodeBlock code="npm install vue-threeui" language="bash" />
      </section>
    </div>

    <!-- Skill.md Tab -->
    <div v-if="activeTab === 'skill'" class="tab-content">
      <section class="skill-section">
        <h2>Skill.md 文档</h2>
        <div class="skill-doc-container">
          <SkillDoc :content="skillContent" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.component-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1.1rem;
  color: #666;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #42b883;
}

.tab-btn.active {
  color: #42b883;
  border-bottom-color: #42b883;
}

.tab-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  margin-bottom: 3rem;
}

section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.preview-section {
  margin-bottom: 3rem;
}

.controls {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
}

.control-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border-radius: 8px;
  padding: 2rem;
  transition: background-color 0.3s;
}

.preview-container.theme-dark {
  background: #111318;
}

.preview-container.theme-light {
  background: #f4f7fb;
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.props-table thead {
  background: #f5f5f5;
}

.props-table th,
.props-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.props-table th {
  font-weight: 600;
  color: #333;
}

.props-table code {
  background: #f0f0f0;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9em;
}

.skill-doc-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
