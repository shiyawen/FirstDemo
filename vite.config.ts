import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// CloudBase 部署配置 - 适配 /demo/ 路径
export default defineConfig({
  plugins: [react()],
  // CloudBase 实际访问路径是 /demo/
  base: '/demo/',
})