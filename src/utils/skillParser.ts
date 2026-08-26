/**
 * SKILL.md 解析器
 * 用于解析组件的 Skill.md 文件，提取 frontmatter 和内容
 */

export interface SkillMeta {
  name: string
  description: string
  [key: string]: string | number | boolean | string[] | undefined
}

export interface SkillParsed {
  meta: SkillMeta
  content: string
}

/**
 * 解析 SKILL.md 文件
 * @param raw - SKILL.md 的原始内容
 * @returns 解析后的元数据和内容
 */
export function parseSkillMarkdown(raw: string): SkillParsed {
  const result: SkillParsed = {
    meta: {
      name: '',
      description: '',
    },
    content: '',
  }

  // 匹配 frontmatter
  const frontmatterMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
  
  if (frontmatterMatch) {
    const frontmatterStr = frontmatterMatch[1] ?? ''
    const contentStr = raw.slice(frontmatterMatch[0].length)
    
    // 解析 frontmatter
    const lines = frontmatterStr.split('\n')
    for (const line of lines) {
      const colonIndex = line.indexOf(':')
      if (colonIndex === -1) continue
      
      const key = line.slice(0, colonIndex).trim()
      let value: string = line.slice(colonIndex + 1).trim()
      
      // 处理数组值
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1)
        result.meta[key] = arrayContent.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
      }
      // 处理数字
      else if (/^\d+(\.\d+)?$/.test(value)) {
        result.meta[key] = parseFloat(value)
      }
      // 处理布尔值
      else if (value === 'true') {
        result.meta[key] = true
      }
      else if (value === 'false') {
        result.meta[key] = false
      }
      // 普通字符串
      else {
        // 去除引号
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        result.meta[key] = value
      }
    }
    
    result.content = contentStr
  } else {
    // 没有 frontmatter，整个文件都是内容
    result.content = raw
  }

  return result
}

/**
 * 从 SKILL.md 提取纯文本（用于搜索）
 * @param raw - SKILL.md 的原始内容
 * @returns 纯文本内容
 */
export function extractSkillText(raw: string): string {
  const parsed = parseSkillMarkdown(raw)
  // 移除 Markdown 语法
  return parsed.content
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/`[^`]+`/g, '')         // 行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // 链接
    .replace(/#{1,6}\s+/g, '')       // 标题
    .replace(/[*_~]+/g, '')          // 强调
    .replace(/\|/g, '')              // 表格分隔符
    .replace(/---+/g, '')            // 水平线
    .replace(/\n{3,}/g, '\n\n')      // 多个空行
    .trim()
}
