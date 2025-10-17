import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' // 导入path模块

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/introduction/', // 设置GitHub Pages部署路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 添加@别名指向src目录
    }
  }
})
