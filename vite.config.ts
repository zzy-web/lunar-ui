import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  build: mode === 'site'
    ? {}
    : {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'LunarUI',
        fileName: 'index'
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: { vue: 'Vue' },
          exports: 'named'
        }
      }
    }
}))
