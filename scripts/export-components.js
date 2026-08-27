#!/usr/bin/env node

/**
 * 批量导出组件脚本
 * 自动扫描 components 目录并生成 index.ts
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.join(__dirname, '../src/components')

async function toPascalCase(str) {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

async function main() {
  console.log('🔍 扫描组件目录...\n')

  const entries = await fs.readdir(componentsDir, { withFileTypes: true })
  const components = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name === 'icons') continue // 跳过图标目录

    const componentDir = path.join(componentsDir, entry.name)
    const files = await fs.readdir(componentDir)
    const vueFiles = files.filter((f) => f.endsWith('.vue'))

    if (vueFiles.length === 0) {
      console.log(`⚠️  跳过 ${entry.name}: 没有 .vue 文件`)
      continue
    }

    const pascalName = await toPascalCase(entry.name)
    const vueFileName = vueFiles[0]

    components.push({
      dirName: entry.name,
      pascalName,
      vueFileName,
    })

    console.log(`✅ ${entry.name} -> ${pascalName}`)
  }

  // 生成 index.ts
  const exports = components.map((c) => {
    return `export { default as ${c.pascalName} } from './${c.dirName}/${c.vueFileName}'`
  })

  const typeExports = components.map((c) => {
    return `export type { ${c.pascalName}Props } from './${c.dirName}/${c.vueFileName}'`
  })

  const content = `// 自动生成的组件导出文件
// 运行 \`node scripts/export-components.js\` 重新生成

${exports.join('\n')}

// Props 类型导出
${typeExports.join('\n')}
`

  await fs.writeFile(path.join(componentsDir, 'index.ts'), content)

  console.log(`\n✅ 已更新 components/index.ts，导出 ${components.length} 个组件`)
}

main().catch((error) => {
  console.error('生成失败:', error)
  process.exit(1)
})
