---
name: vue-fireworks-backdrop
description: Vue 3 门户烟花背景。Three.js 细粒子立体烟花，电影运镜：全景缓摇、落到下方仰视、急旋拉近特写至消散后循环。使用方式：铺满容器，传入 palette / mode。
---

# 烟花背景组件 (Fireworks Backdrop)

## 功能描述

面向门户网站全屏背景的 WebGL 烟花。约 24 秒一条电影镜头循环：

1. 全景：远距离缓摇，看见空中多层绽放
2. 落到地面附近，从烟花正下方仰视球形炸开
3. 急速旋转并拉近到单朵特写，直到火花消失
4. 拉回全景，再循环

默认 `pointer-events: none`，可叠在页面内容下面，不挡住点击。

## 技术栈

- Vue 3 Composition API
- TypeScript
- Three.js（Points + AdditiveBlending）

## 安装与导入

```typescript
import { FireworksBackdrop } from 'vue-threeui'
```

## 使用示例

```vue
<script setup lang="ts">
import { FireworksBackdrop } from 'vue-threeui'
</script>

<template>
  <div class="hero">
    <FireworksBackdrop palette="night" mode="dark" />
    <div class="hero__content">门户标题</div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
}
.hero :deep(.fireworks-backdrop) {
  position: absolute;
  inset: 0;
}
.hero__content {
  position: relative;
  z-index: 1;
}
</style>
```

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| palette | 'night' \| 'festival' \| 'gold' | 'night' | 烟花配色 |
| variant | 同 palette | - | 与 palette 等价，便于文档站变体切换 |
| mode | 'dark' \| 'light' | 'dark' | 夜空 / 暮色天空 |
| intensity | number | 1 | 燃放密度，0.35 ~ 2 |
| paused | boolean | false | 暂停镜头与粒子 |
| hue | number | 0 | CSS 色相偏移 |
| saturation | number | 1 | CSS 饱和度 |
| brightness | number | 1 | CSS 亮度 |

离开视口会自动暂停，减少后台 GPU 占用。`prefers-reduced-motion: reduce` 时会降速、降密度。

## 最佳实践

1. 父级给出明确宽高（如 `100vh` 或绝对铺满），否则画布高度会偏矮
2. 内容层单独 `z-index`，背景保持 `pointer-events: none`
3. 同一页不要同时挂太多实例；目录卡片预览已按视口暂停
4. 门户首屏用 `palette="night"`；节日活动用 `festival`

## 常见问题

### Q: 看不见烟花？
A: 检查容器高度是否为 0。组件需要可测量的 `clientHeight`。

### Q: 如何当页面背景？
A: 外层 `position: relative`，组件 `position: absolute; inset: 0`，正文相对定位叠在上面。
