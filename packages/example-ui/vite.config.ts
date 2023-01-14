import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
  plugins: [react(), vanillaExtractPlugin()],
})
