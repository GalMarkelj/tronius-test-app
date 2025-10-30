import { defineConfig } from 'vite'
import process from 'node:process'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT),
  },
})
