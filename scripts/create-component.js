#!/usr/bin/env node
/**
 * 组件生成脚本
 * 用于快速创建新组件的基础结构
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../src/components')

const VUE_TEMPLATE = `<script setup lang="ts">
import './{{name}}.css'
import { computed } from 'vue'

export interface {{Name}}Props {
  // TODO: 定义组件的 props
}

const props = withDefaults(defineProps<{{Name}}Props>(), {
  // TODO: 设置默认值
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <div class="{{name}}">
    <!-- TODO: 实现组件模板 -->
    <button @click="handleClick">{{Name}}</button>
  </div>
</template>

<style scoped>
.{{name}} {
  /* TODO: 添加样式 */
}
</style>
`

const CSS_TEMPLATE = `.{{name}} {
  /* TODO: 添加样式 */
}
`

const SKILL_TEMPLATE = `---
name: vue-{{name}}
description: {{description}}
version: 1.0.0
tags: {{tags}}
---

# {{Name}} 组件

## 概述

{{description}}

## 使用方式

\`\`\`vue
<script setup lang="ts">
import { {{Name}} } from 'vue-threeui'
</script>

<template>
  <{{Name}} />
</template>
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| - | - | - | - |

## 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| click | MouseEvent | 点击事件 |

## 示例

### 基础用法

\`\`\`vue
<{{Name}} />
\`\`\`

## 注意事项

- 请根据实际情况修改此文件

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90
`

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function createComponent(name, description = '') {
  const kebabName = toKebabCase(name)
  const pascalName = toPascalCase(kebabName)
  const componentDir = path.join(COMPONENTS_DIR, kebabName)
  
  // 创建组件目录
  if (fs.existsSync(componentDir)) {
    console.error(`✗ 组件目录已存在: ${componentDir}`)
    process.exit(1)
  }
  
  fs.mkdirSync(componentDir, { recursive: true })
  
  // 生成 Vue 组件
  const vueContent = VUE_TEMPLATE
    .replace(/\{\{name\}\}/g, kebabName)
    .replace(/\{\{Name\}\}/g, pascalName)
  
  fs.writeFileSync(
    path.join(componentDir, `${pascalName}.vue`),
    vueContent,
    'utf-8'
  )
  console.log(`✓ 已创建: ${pascalName}.vue`)
  
  // 生成 CSS
  const cssContent = CSS_TEMPLATE.replace(/\{\{name\}\}/g, kebabName)
  fs.writeFileSync(
    path.join(componentDir, `${kebabName}.css`),
    cssContent,
    'utf-8'
  )
  console.log(`✓ 已创建: ${kebabName}.css`)
  
  // 生成 SKILL.md
  const skillContent = SKILL_TEMPLATE
    .replace(/\{\{name\}\}/g, kebabName)
    .replace(/\{\{Name\}\}/g, pascalName)
    .replace(/\{\{description\}\}/g, description || `${pascalName} 组件`)
    .replace(/\{\{tags\}\}/g, '[]')
  
  fs.writeFileSync(
    path.join(componentDir, 'SKILL.md'),
    skillContent,
    'utf-8'
  )
  console.log(`✓ 已创建: SKILL.md`)
  
  console.log(`\n✓ 组件 ${pascalName} 创建成功！`)
  console.log(`  目录: ${componentDir}`)
  console.log(`\n下一步:`)
  console.log(`  1. 编辑 ${pascalName}.vue 实现组件功能`)
  console.log(`  2. 编辑 ${kebabName}.css 添加样式`)
  console.log(`  3. 编辑 SKILL.md 补充文档`)
  console.log(`  4. 在 src/components/index.ts 中导出组件`)
}

// 命令行参数处理
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
用法:
  node scripts/create-component.js <组件名> [描述]

示例:
  node scripts/create-component.js loading-spinner
  node scripts/create-component.js modal-dialog "模态对话框组件"
`)
  process.exit(0)
}

const componentName = args[0]
const description = args.slice(1).join(' ')

createComponent(componentName, description)
