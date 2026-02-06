import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ecosform/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  },
  server: {
    port: 5180,
    host: true
  }
})
