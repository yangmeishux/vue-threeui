import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
      name: 'VueThreeUI',
      formats: ['es', 'umd'],
      fileName: (format) => `vue-threeui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'three'],
      output: {
        globals: {
          vue: 'Vue',
          three: 'THREE',
        },
      },
    },
    outDir: 'lib-dist',
    sourcemap: true,
    emptyOutDir: true,
  },
})
