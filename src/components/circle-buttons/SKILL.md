---
name: vue-circle-buttons
description: Vue 3 圆形按钮组件，提供三种风格：暗色玻璃（play）、琥珀渐变（plus）、点阵边框（mail）。使用方式：导入组件，传入 variant 和 mode 属性。
---

# 圆形按钮组件 (Circle Buttons)

## 功能描述

三种风格的圆形图标按钮组件，基于纯 CSS 实现，支持深色/浅色主题切换。

### 三种变体

- **play**：暗色玻璃效果，带有光晕动画和悬停高亮
- **plus**：琥珀色渐变，带有 3D 按压效果
- **mail**：透明边框，悬停时显示点阵装饰框

## 技术栈

- Vue 3 Composition API
- TypeScript
- 纯 CSS（无 JavaScript 动画）
- 响应式设计

## 安装与导入

```typescript
import { CircleButtons } from 'vue-threeui'
```

## 使用方式

```vue
<script setup lang="ts">
import { CircleButtons } from 'vue-threeui'

function handleClick() {
  console.log('按钮被点击')
}
</script>

<template>
  <CircleButtons 
    variant="play" 
    mode="dark" 
    @click="handleClick" 
  />
</template>
```

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'play' \| 'plus' \| 'mail' | 'play' | 按钮风格 |
| mode | 'dark' \| 'light' | 'dark' | 主题模式 |
| ariaLabel | string | - | 无障碍标签 |
| disabled | boolean | false | 禁用状态 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | MouseEvent | 点击事件 |

## 最佳实践

1. **无障碍**：始终提供 `ariaLabel` 属性，特别是当按钮没有文本时
2. **主题一致性**：在同一界面中保持 mode 一致
3. **响应式**：组件会自动适配容器大小
4. **性能**：组件使用纯 CSS 动画，性能优于 JavaScript 动画

## 常见问题

### Q: 如何修改按钮大小？
A: 通过父容器的 `width` 和 `height` 控制，按钮会自动适配。

### Q: 如何自定义颜色？
A: 当前版本使用预设配色。如需自定义，可以 fork 项目修改 CSS 变量。

### Q: 支持哪些浏览器？
A: 支持所有现代浏览器（Chrome 90+、Firefox 88+、Safari 14+、Edge 90+）。

## 验证清单

使用此组件时，请检查：

- [ ] 已正确导入组件
- [ ] 已提供合适的 variant 值
- [ ] 已设置正确的 theme 模式
- [ ] 已绑定 click 事件处理函数
- [ ] 已添加 ariaLabel 以提升无障碍体验
- [ ] 已在不同屏幕尺寸下测试过响应式表现

## 防护栏

- 不要直接修改组件内部的 CSS 类名
- 不要覆盖组件的默认样式，使用 CSS 变量或父容器控制
- 不要在组件外层添加 `overflow: hidden`，会影响动画效果
