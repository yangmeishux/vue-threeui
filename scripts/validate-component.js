#!/usr/bin/env node

/**
 * 组件验证脚本
 * 检查组件是否符合发布标准
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.join(__dirname, '../src/components')

const REQUIRED_FILES = ['SKILL.md']
const REQUIRED_SKILL_SECTIONS = [
  'name:',
  'description:',
  '## 使用示例',
  '## Props 说明',
  '## 最佳实践',
]

async function validateComponent(componentName) {
  const componentDir = path.join(componentsDir, componentName)
  const errors = []
  const warnings = []

  try {
    const stat = await fs.stat(componentDir)
    if (!stat.isDirectory()) {
      errors.push(`${componentName} 不是目录`)
      return { errors, warnings }
    }
  } catch {
    errors.push(`组件目录不存在: ${componentName}`)
    return { errors, warnings }
  }

  // 检查必要文件
  for (const file of REQUIRED_FILES) {
    try {
      await fs.access(path.join(componentDir, file))
    } catch {
      errors.push(`缺少必要文件: ${file}`)
    }
  }

  // 检查 Vue 文件
  const vueFiles = (await fs.readdir(componentDir)).filter((f) => f.endsWith('.vue'))
  if (vueFiles.length === 0) {
    errors.push('缺少 .vue 组件文件')
  } else {
    // 检查 Vue 文件内容
    for (const vueFile of vueFiles) {
      const content = await fs.readFile(path.join(componentDir, vueFile), 'utf-8')
      
      if (!content.includes('<script setup lang="ts">')) {
        warnings.push(`${vueFile}: 建议使用 <script setup lang="ts">`)
      }
      
      if (!content.includes('defineProps')) {
        warnings.push(`${vueFile}: 未定义 Props`)
      }
      
      if (!content.includes('onUnmounted')) {
        const hasThreeJS = content.includes('import * as THREE') || content.includes('from \'three\'')
        if (hasThreeJS) {
          warnings.push(`${vueFile}: 使用了 Three.js 但未在 onUnmounted 中清理资源`)
        }
      }
    }
  }

  // 检查 CSS 文件
  const cssFiles = (await fs.readdir(componentDir)).filter((f) => f.endsWith('.css'))
  if (cssFiles.length === 0) {
    warnings.push('缺少 .css 样式文件')
  }

  // 检查 SKILL.md 内容
  try {
    const skillContent = await fs.readFile(path.join(componentDir, 'SKILL.md'), 'utf-8')
    
    for (const section of REQUIRED_SKILL_SECTIONS) {
      if (!skillContent.includes(section)) {
        warnings.push(`SKILL.md 缺少必要章节: ${section}`)
      }
    }

    // 检查 frontmatter
    if (!skillContent.startsWith('---')) {
      errors.push('SKILL.md 缺少 frontmatter (以 --- 开头)')
    }
  } catch {
    // SKILL.md 不存在已在前面检查
  }

  // 检查是否在 index.ts 中导出
  try {
    const indexContent = await fs.readFile(path.join(componentsDir, 'index.ts'), 'utf-8')
    const pascalName = componentName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
    
    if (!indexContent.includes(pascalName)) {
      warnings.push(`未在 components/index.ts 中导出 ${pascalName}`)
    }
  } catch {
    errors.push('无法读取 components/index.ts')
  }

  return { errors, warnings }
}

async function main() {
  const componentName = process.argv[2]

  if (componentName) {
    // 验证单个组件
    console.log(`🔍 验证组件: ${componentName}\n`)
    const { errors, warnings } = await validateComponent(componentName)

    if (errors.length > 0) {
      console.log('❌ 错误:')
      errors.forEach((e) => console.log(`   - ${e}`))
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  警告:')
      warnings.forEach((w) => console.log(`   - ${w}`))
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ 组件验证通过！')
      process.exit(0)
    } else {
      process.exit(errors.length > 0 ? 1 : 0)
    }
  } else {
    // 验证所有组件
    console.log('🔍 验证所有组件...\n')
    const components = (await fs.readdir(componentsDir)).filter((name) => {
      return !name.endsWith('.ts') && !name.endsWith('.vue') && name !== 'icons'
    })

    let hasErrors = false

    for (const component of components) {
      console.log(`📦 ${component}`)
      const { errors, warnings } = await validateComponent(component)

      if (errors.length > 0) {
        hasErrors = true
        console.log('  ❌ 错误:')
        errors.forEach((e) => console.log(`     - ${e}`))
      }

      if (warnings.length > 0) {
        console.log('  ⚠️  警告:')
        warnings.forEach((w) => console.log(`     - ${w}`))
      }

      if (errors.length === 0 && warnings.length === 0) {
        console.log('  ✅ 通过')
      }

      console.log()
    }

    process.exit(hasErrors ? 1 : 0)
  }
}

main().catch((error) => {
  console.error('验证失败:', error)
  process.exit(1)
})
