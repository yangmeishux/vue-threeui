#!/usr/bin/env node
/**
 * Skill.md 生成脚本
 * 用于快速生成新组件的 SKILL.md 模板
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.resolve(__dirname, '../src/components')

const SKILL_TEMPLATE = `---
name: vue-{name}
description: Vue 3 {displayName}组件
tags: [{tags}]
---

# {displayName}组件 ({Name})

## 功能描述

组件的主要功能和特性。

## 技术栈

- Vue 3 Composition API
- TypeScript

## 安装与导入

\`\`\`typescript
import { Name } from 'vue-threeui'
\`\`\`

## 使用方式

\`\`\`vue
<script setup lang="ts">
import { Name } from 'vue-threeui'
</script>

<template>
  <Name />
</template>
\`\`\`

## Props 说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| prop1 | string | '' | 属性说明 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | MouseEvent | 点击事件 |

## 最佳实践

1. 第一条建议
2. 第二条建议

## 验证清单

使用此组件时，请检查：

- [ ] 已正确导入组件
- [ ] 已提供必要的 Props
- [ ] 已在不同屏幕尺寸下测试过响应式表现
`

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toDisplayName(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function generateSkill(componentName, tags = []) {
  const name = componentName.toLowerCase()
  const pascalName = toPascalCase(name)
  const displayName = toDisplayName(name)
  const tagsStr = tags.join(', ')

  const content = SKILL_TEMPLATE
    .replace(/\{name\}/g, name)
    .replace(/\{Name\}/g, pascalName)
    .replace(/\{displayName\}/g, displayName)
    .replace(/\{tags\}/g, tagsStr)

  const componentDir = path.join(COMPONENTS_DIR, name)
  
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true })
  }

  const skillPath = path.join(componentDir, 'SKILL.md')
  
  if (fs.existsSync(skillPath)) {
    console.error(`✗ SKILL.md 已存在: ${skillPath}`)
    process.exit(1)
  }

  fs.writeFileSync(skillPath, content, 'utf-8')
  console.log(`✓ 已生成 SKILL.md: ${skillPath}`)
}

// 命令行参数处理
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
使用方法:
  node scripts/generate-skill.js <组件名> [标签1,标签2,...]

示例:
  node scripts/generate-skill.js circle-buttons 按钮,交互,CSS
  node scripts/generate-skill.js animated-card 卡片,动画
`)
  process.exit(0)
}

const componentName = args[0]
const tags = args[1] ? args[1].split(',').map(t => t.trim()) : []

generateSkill(componentName, tags)
