# 自定义组件开发指南

本指南将帮助你为 Vue ThreeUI 开发自定义的 Three.js 组件。

## 目录结构

每个组件应该遵循以下目录结构：

```
src/components/
└── my-component/          # 组件目录（kebab-case）
    ├── MyComponent.vue    # Vue 组件文件（PascalCase）
    ├── my-component.css   # 样式文件（kebab-case）
    └── SKILL.md           # AI 可读的技能文档
```

## 开发步骤

### 1. 创建组件骨架

使用提供的脚本快速创建组件：

```bash
npm run create-component my-component
```

这会创建上述三个文件的基础模板。

### 2. 实现 Vue 组件

使用 Vue 3 Composition API 和 TypeScript：

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import './my-component.css'

// 定义 Props 类型
interface Props {
  width?: number
  height?: number
  color?: string
  // ... 其他属性
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
  color: '#42b883',
})

// 定义 Events
const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'update', value: number): void
}>()

// 响应式数据
const containerRef = ref<HTMLDivElement>()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number

// 初始化 Three.js 场景
function initScene() {
  if (!containerRef.value) return

  // 创建场景
  scene = new THREE.Scene()

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    props.width / props.height,
    0.1,
    1000
  )
  camera.position.z = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(props.width, props.height)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  containerRef.value.appendChild(renderer.domElement)

  // 添加物体
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: props.color })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  // 通知父组件
  emit('ready')
}

// 动画循环
function animate() {
  animationId = requestAnimationFrame(animate)
  
  // 更新场景
  // ...
  
  renderer.render(scene, camera)
}

// 监听属性变化
watch(() => props.color, (newColor) => {
  // 更新材质颜色
})

// 生命周期
onMounted(() => {
  initScene()
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  renderer?.dispose()
  geometry?.dispose()
  material?.dispose()
})
</script>

<template>
  <div 
    ref="containerRef"
    class="my-component"
    :style="{ width: `${width}px`, height: `${height}px` }"
  />
</template>
```

### 3. 编写样式文件

```css
.my-component {
  position: relative;
  overflow: hidden;
  background: transparent;
}

.my-component canvas {
  display: block;
}
```

### 4. 编写 SKILL.md

这是最重要的部分，它让 AI 能够理解和使用你的组件：

```markdown
---
name: my-component
description: 一个自定义的 Three.js 3D 组件，用于展示...
version: 1.0.0
author: Your Name
tags: [3d, three.js, custom]
---

# My Component

## 功能描述

描述这个组件的功能和使用场景。

## 使用示例

### 基础用法

```vue
<script setup>
import { MyComponent } from 'vue-threeui'
</script>

<template>
  <MyComponent />
</template>
```

### 自定义属性

```vue
<MyComponent 
  :width="800"
  :height="600"
  color="#ff0000"
/>
```

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 400 | 宽度（像素） |
| height | number | 300 | 高度（像素） |
| color | string | '#42b883' | 主色调 |

## Events 说明

| 事件 | 参数 | 说明 |
|------|------|------|
| ready | - | 组件初始化完成 |
| update | value: number | 数值更新 |

## 最佳实践

1. 始终在 onUnmounted 中清理 Three.js 资源
2. 使用 watch 监听属性变化
3. 考虑响应式设计
4. 添加适当的 ARIA 标签

## 常见问题

### Q: 组件不显示？
A: 检查容器是否有正确的宽高，确保父元素没有被设置为 display: none。

### Q: 性能问题？
A: 使用 requestAnimationFrame 控制渲染循环，避免在动画中创建新对象。

## 注意事项

- 不要在组件外部直接操作 DOM
- 确保所有 Three.js 资源都被正确释放
- 考虑移动端的性能限制
```

### 5. 导出组件

在 `src/components/index.ts` 中添加导出：

```typescript
export { default as MyComponent } from './my-component/MyComponent.vue'
export type { default as MyComponentType } from './my-component/MyComponent.vue'
```

### 6. 添加到组件元数据

在 `src/data/components.ts` 中添加：

```typescript
{
  id: 'my-component',
  name: '我的组件',
  category: '自定义',
  description: '一个自定义的 Three.js 3D 组件',
  tags: ['3d', 'three.js', 'custom'],
  path: '/component/my-component',
}
```

### 7. 创建文档页面

创建 `src/pages/MyComponentPage.vue`：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { MyComponent } from '@/components'
import CodeBlock from '@/docs/components/CodeBlock.vue'
import SkillDoc from '@/docs/components/SkillDoc.vue'

const activeTab = ref<'preview' | 'usage' | 'skill'>('preview')

const props = ref({
  width: 400,
  height: 300,
  color: '#42b883',
})

const usageCode = computed(() => `
<script setup>
import { MyComponent } from 'vue-threeui'
</script>

<template>
  <MyComponent 
    :width="${props.value.width}"
    :height="${props.value.height}"
    color="${props.value.color}"
  />
</template>
`)
</script>

<template>
  <div class="component-page">
    <header>
      <h1>My Component</h1>
      <p>一个自定义的 Three.js 3D 组件</p>
    </header>

    <div class="tabs">
      <button @click="activeTab = 'preview'" :class="{ active: activeTab === 'preview' }">
        预览
      </button>
      <button @click="activeTab = 'usage'" :class="{ active: activeTab === 'usage' }">
        使用
      </button>
      <button @click="activeTab = 'skill'" :class="{ active: activeTab === 'skill' }">
        Skill.md
      </button>
    </div>

    <div v-if="activeTab === 'preview'" class="preview">
      <div class="controls">
        <label>
          宽度:
          <input type="range" v-model.number="props.width" min="200" max="800" />
          {{ props.width }}px
        </label>
        <label>
          颜色:
          <input type="color" v-model="props.color" />
        </label>
      </div>
      <div class="preview-container">
        <MyComponent v-bind="props" />
      </div>
    </div>

    <div v-if="activeTab === 'usage'" class="usage">
      <h3>基础用法</h3>
      <CodeBlock :code="usageCode" language="vue" />
    </div>

    <div v-if="activeTab === 'skill'" class="skill">
      <SkillDoc skill-id="my-component" />
    </div>
  </div>
</template>
```

### 8. 添加路由

在 `src/router/index.ts` 中添加：

```typescript
{
  path: '/component/my-component',
  name: 'my-component',
  component: () => import('@/pages/MyComponentPage.vue'),
}
```

## Three.js 最佳实践

### 性能优化

```typescript
// ✅ 使用 BufferGeometry
const geometry = new THREE.BoxGeometry()

// ✅ 复用材质
const material = new THREE.MeshBasicMaterial()

// ✅ 使用 InstancedMesh 渲染多个相同物体
const mesh = new THREE.InstancedMesh(geometry, material, count)

// ✅ 在组件卸载时清理资源
onUnmounted(() => {
  geometry.dispose()
  material.dispose()
  renderer.dispose()
})
```

### 响应式设计

```typescript
// 监听容器尺寸变化
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
})

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver.disconnect()
})
```

### 内存管理

```typescript
// 使用 WeakRef 避免内存泄漏
const sceneRef = new WeakRef<THREE.Scene>()

// 定期清理未使用的资源
function cleanup() {
  renderer.info.reset()
}

// 使用 dispose 方法释放资源
function disposeObject(object: THREE.Object3D) {
  if (object instanceof THREE.Mesh) {
    object.geometry.dispose()
    if (object.material instanceof THREE.Material) {
      object.material.dispose()
    }
  }
  object.parent?.remove(object)
}
```

## 调试技巧

### 1. 启用调试模式

```vue
<script setup>
import { onMounted } from 'vue'
import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb

onMounted(() => {
  document.body.appendChild(stats.dom)
  
  function animate() {
    stats.begin()
    // 渲染代码
    stats.end()
    requestAnimationFrame(animate)
  }
  animate()
})
</script>
```

### 2. 使用 Vue DevTools

安装 Vue DevTools 浏览器扩展，可以：
- 查看组件状态
- 追踪响应式数据变化
- 检查组件树

### 3. Three.js 调试工具

```typescript
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.js'

const gui = new GUI()
gui.add(camera.position, 'z', 0, 10)
gui.addColor(material, 'color')
```

## 测试组件

### 单元测试

```typescript
// src/components/my-component/__tests__/MyComponent.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.find('.my-component').exists()).toBe(true)
  })

  it('emits ready event', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('ready')).toBeTruthy()
  })
})
```

### 视觉测试

在文档站点中测试不同尺寸和配置：

```vue
<MyComponent :width="200" :height="200" />
<MyComponent :width="400" :height="400" />
<MyComponent :width="800" :height="600" />
```

## 发布清单

在发布组件前，检查以下事项：

- [ ] 组件代码符合 TypeScript 类型要求
- [ ] 所有 Three.js 资源都在 onUnmounted 中清理
- [ ] SKILL.md 文档完整且准确
- [ ] 添加了适当的 ARIA 标签
- [ ] 测试了响应式设计
- [ ] 添加了错误处理
- [ ] 更新了组件元数据
- [ ] 创建了文档页面
- [ ] 通过了 lint 检查

## 常见问题

### Q: 如何处理 WebGL 上下文丢失？

```typescript
renderer.domElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault()
  cancelAnimationFrame(animationId)
})

renderer.domElement.addEventListener('webglcontextrestored', () => {
  initScene()
  animate()
})
```

### Q: 如何支持 SSR？

Three.js 组件无法在 SSR 中使用，使用动态导入：

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const MyComponent = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'),
  ssr: false,
})
</script>
```

### Q: 如何处理移动端触摸事件？

```typescript
const touchStart = ref({ x: 0, y: 0 })

function onTouchStart(event: TouchEvent) {
  touchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  }
}

function onTouchMove(event: TouchEvent) {
  const dx = event.touches[0].clientX - touchStart.value.x
  const dy = event.touches[0].clientY - touchStart.value.y
  // 处理触摸移动
}
```

## 下一步

- 查看其他组件的实现
- 阅读 Three.js 官方文档
- 学习 WebGL 基础知识
- 探索着色器（Shaders）

祝你开发愉快！🎉
