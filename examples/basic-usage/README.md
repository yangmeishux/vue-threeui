# Vue ThreeUI 使用示例

本示例展示如何在 Vue 3 项目中使用 vue-threeui 组件库。

## 项目结构

```
examples/basic-usage/
├── src/
│   ├── App.vue              # 主应用组件
│   ├── main.ts              # 入口文件
│   └── components/
│       └── Demo.vue         # 演示组件
├── index.html               # HTML 模板
├── package.json             # 依赖配置
└── vite.config.ts           # Vite 配置
```

## 安装和运行

```bash
# 进入示例项目目录
cd examples/basic-usage

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 功能演示

### 1. CircleButtons 组件

演示三种不同风格的圆形按钮：

```vue
<script setup>
import { CircleButtons } from 'vue-threeui'
</script>

<template>
  <div class="demo-container">
    <!-- Play 风格 - 暗色玻璃效果 -->
    <CircleButtons variant="play" mode="dark" />
    
    <!-- Plus 风格 - 琥珀渐变效果 -->
    <CircleButtons variant="plus" mode="light" />
    
    <!-- Mail 风格 - 点阵边框效果 -->
    <CircleButtons variant="mail" mode="dark" />
  </div>
</template>
```

### 2. Props 配置

展示如何配置组件属性：

```vue
<template>
  <div>
    <!-- 自定义尺寸 -->
    <CircleButtons 
      :width="200"
      :height="200"
    />
    
    <!-- 自定义颜色 -->
    <CircleButtons 
      :color="'#ff6b6b'"
    />
    
    <!-- 禁用状态 -->
    <CircleButtons 
      :disabled="true"
    />
    
    <!-- 带无障碍标签 -->
    <CircleButtons 
      :aria-label="'播放按钮'"
    />
  </div>
</template>
```

### 3. 事件处理

展示如何处理组件事件：

```vue
<script setup>
import { ref } from 'vue'
import { CircleButtons } from 'vue-threeui'

const clickCount = ref(0)

function handleClick() {
  clickCount.value++
  console.log(`按钮被点击了 ${clickCount.value} 次`)
}
</script>

<template>
  <div>
    <p>点击次数: {{ clickCount }}</p>
    <CircleButtons @click="handleClick" />
  </div>
</template>
```

### 4. 动态主题切换

展示如何在深色和浅色主题之间切换：

```vue
<script setup>
import { ref } from 'vue'
import { CircleButtons } from 'vue-threeui'

const isDarkMode = ref(true)

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <div :class="{ 'dark-theme': isDarkMode, 'light-theme': !isDarkMode }">
    <button @click="toggleTheme">切换主题</button>
    <CircleButtons :mode="isDarkMode ? 'dark' : 'light'" />
  </div>
</template>
```

### 5. 响应式布局

展示如何在不同屏幕尺寸下使用：

```vue
<template>
  <div class="responsive-container">
    <div class="button-grid">
      <CircleButtons variant="play" />
      <CircleButtons variant="plus" />
      <CircleButtons variant="mail" />
    </div>
  </div>
</template>

<style>
.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .button-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

## 样式定制

### 方法 1: 使用 CSS 变量

```vue
<template>
  <div class="custom-container">
    <CircleButtons />
  </div>
</template>

<style>
.custom-container {
  --circle-button-primary-color: #ff6b6b;
  --circle-button-hover-color: #ff8787;
  --circle-button-border-radius: 12px;
}
</style>
```

### 方法 2: 使用 scoped 样式

```vue
<template>
  <CircleButtons class="my-button" />
</template>

<style scoped>
.my-button :deep(.circle-button__icon) {
  transform: scale(1.2);
  transition: transform 0.3s ease;
}

.my-button:hover :deep(.circle-button__icon) {
  transform: scale(1.4) rotate(15deg);
}
</style>
```

## TypeScript 支持

完整的类型定义：

```vue
<script setup lang="ts">
import { CircleButtons } from 'vue-threeui'
import type { CircleButtonsProps } from 'vue-threeui'

const props: CircleButtonsProps = {
  variant: 'play',
  mode: 'dark',
  width: 100,
  height: 100,
}
</script>

<template>
  <CircleButtons v-bind="props" />
</template>
```

## 懒加载

使用动态导入优化性能：

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const CircleButtons = defineAsyncComponent(() =>
  import('vue-threeui').then(module => module.CircleButtons)
)
</script>
```

## 常见问题

### 1. 组件不显示？

确保：
- 已正确导入组件
- 容器有明确的宽高
- 没有 CSS 冲突

```vue
<template>
  <div style="width: 200px; height: 200px;">
    <CircleButtons />
  </div>
</template>
```

### 2. 样式不生效？

确保引入了样式文件：

```typescript
import 'vue-threeui/dist/style.css'
```

### 3. TypeScript 类型错误？

确保安装了正确的版本：

```json
{
  "dependencies": {
    "vue-threeui": "^0.1.0"
  }
}
```

## 完整示例代码

查看 `src/App.vue` 获取完整的使用示例。

## 下一步

- 阅读 [API 文档](../../README.md#api)
- 查看 [组件开发指南](../../DEVELOPMENT_GUIDE.md)
- 探索 [更多组件](../../src/components)
