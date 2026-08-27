# Vue ThreeUI

基于 Vue 3 和 Three.js 的现代化组件库，提供高质量的 3D 视觉效果组件。

## 特性

- 🎨 **精美的视觉效果** - 基于 Three.js 的专业 3D 效果
- ⚡ **高性能** - 优化的渲染循环和内存管理
- 🎯 **类型安全** - 完整的 TypeScript 支持
- 📦 **按需加载** - Tree-shaking 友好
- 🌙 **深色/浅色主题** - 内置主题切换支持
- 📖 **完整的文档** - 每个组件都有详细的 Skill.md 文档

## 安装

```bash
npm install vue-threeui
```

## 快速开始

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

## 组件列表

### 交互元素

#### CircleButtons - 圆形按钮

三种风格的圆形图标按钮，包含暗色玻璃、琥珀渐变、点阵边框效果。

**属性 (Props)**

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| variant | `'play' \| 'plus' \| 'mail'` | `'play'` | 按钮风格 |
| mode | `'dark' \| 'light'` | `'dark'` | 主题模式 |
| ariaLabel | `string` | - | 无障碍标签 |
| disabled | `boolean` | `false` | 是否禁用 |

**事件 (Events)**

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | `MouseEvent` | 点击事件 |

**使用示例**

```vue
<script setup lang="ts">
import { CircleButtons } from 'vue-threeui'
</script>

<template>
  <!-- Play 风格 - 暗色玻璃效果 -->
  <CircleButtons variant="play" mode="dark" />
  
  <!-- Plus 风格 - 琥珀渐变效果 -->
  <CircleButtons variant="plus" mode="light" />
  
  <!-- Mail 风格 - 点阵边框效果 -->
  <CircleButtons variant="mail" mode="dark" />
</template>
```

## 开发

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建文档站点
npm run build

# 构建组件库
npm run build:lib

# 运行代码检查
npm run type-check
```

### 创建新组件

使用提供的脚本快速创建新组件：

```bash
# 创建组件骨架
npm run create-component my-component

# 生成 Skill.md 文档
npm run generate-skill my-component
```

### 项目结构

```
vue-threeui/
├── src/
│   ├── components/          # 组件源码
│   │   ├── circle-buttons/
│   │   │   ├── CircleButtons.vue
│   │   │   ├── circle-buttons.css
│   │   │   └── SKILL.md
│   │   └── index.ts         # 组件导出
│   ├── composables/         # Vue Composables
│   │   ├── useThreeRenderer.ts
│   │   └── useResizeObserver.ts
│   ├── lib/                 # 库入口
│   │   └── index.ts
│   ├── pages/               # 文档页面
│   ├── docs/                # 文档组件
│   ├── data/                # 组件元数据
│   └── utils/               # 工具函数
├── scripts/                 # 构建脚本
├── dist/                    # 文档站点构建
└── lib-dist/                # 组件库构建
```

## 组件开发指南

### 1. 创建组件目录

```bash
npm run create-component my-button
```

这会创建：
- `src/components/my-button/MyButton.vue` - 组件文件
- `src/components/my-button/my-button.css` - 样式文件
- `src/components/my-button/SKILL.md` - 组件文档

### 2. 实现组件

使用 Vue 3 Composition API 和 TypeScript：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import './my-button.css'

interface Props {
  label: string
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button 
    class="my-button"
    :class="`my-button--${variant}`"
    @click="emit('click', $event)"
  >
    {{ label }}
  </button>
</template>
```

### 3. 导出组件

在 `src/components/index.ts` 中添加导出：

```typescript
export { default as MyButton } from './my-button/MyButton.vue'
```

### 4. 编写 Skill.md

为每个组件编写详细的 Skill.md 文档，包含：
- 组件功能描述
- Props 和 Events 说明
- 使用示例
- 最佳实践
- 常见问题

### 5. 构建和测试

```bash
# 构建库
npm run build:lib

# 在文档站点中测试
npm run dev
```

## 技术栈

- **Vue 3** - Composition API 和 TypeScript
- **Three.js** - 3D 渲染引擎
- **Vite** - 构建工具
- **TypeScript** - 类型安全
- **Markdown-it** - 文档渲染

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关链接

- [Three.js 文档](https://threejs.org/docs/)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
