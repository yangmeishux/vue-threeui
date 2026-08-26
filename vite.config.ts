import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 自定义插件：支持导入 .md 文件为原始文本
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.endsWith('.md')) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null,
          }
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
