import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      process: 'process/browser',
      util: 'util',
    },
  },
  test: {
    environment: 'jsdom',
  },
  plugins: [react(), vanillaExtractPlugin()],
})
