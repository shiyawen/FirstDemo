import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// CloudBase 部署配置 - 使用根路径
export default defineConfig({
  plugins: [react()],
  // CloudBase 部署到根目录，不需要 base 配置
  // base: '/',
})