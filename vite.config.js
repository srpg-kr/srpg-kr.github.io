import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        live2d: resolve(__dirname, 'live2d/index.html'),
        'live2d-stellarsora': resolve(__dirname, 'live2d/stellarsora/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@framework': '/framework'
    }
  }
})
