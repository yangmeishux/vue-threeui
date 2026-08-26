export default {
  methods: {
    highlightCode(code: string, language: string): string {
      // 简单的语法高亮（后续可以集成 prismjs 或 highlight.js）
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      
      if (language === 'vue' || language === 'html') {
        return escaped
          .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="token tag">$2</span>')
          .replace(/([\w-]+)(=)/g, '<span class="token attr-name">$1</span>$2')
          .replace(/(".*?")/g, '<span class="token attr-value">$1</span>')
      }
      
      if (language === 'typescript' || language === 'javascript') {
        return escaped
          .replace(/\b(const|let|var|function|return|import|export|from|interface|type|default)\b/g, '<span class="token keyword">$1</span>')
          .replace(/(\/\/.*$)/gm, '<span class="token comment">$1</span>')
          .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="token string">$1</span>')
      }
      
      return escaped
    },
  },
}
