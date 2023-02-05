import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@gateway/common-ts',
  entry: ['src/index.tsx'],
  outDir: 'dist',
  format: ['esm', 'cjs', 'iife'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
