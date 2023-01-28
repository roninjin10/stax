import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@gateway/common-ts',
  entry: ['src/index.ts', 'src/run.ts'],
  outDir: 'dist',
  noExternal: [/.*/],
  format: ['esm', 'cjs', 'iife'],
  target: 'node18',
  splitting: false,
  sourcemap: true,
  clean: true,
})
