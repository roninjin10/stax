import { defineConfig } from 'tsup'

/**
 * Note: tsup is smart enough to know that the entry file src/index.tsx
 * is an executable because of it's
 * #! /usr/bin/env node
 *
 * @see https://tsup.egoist.dev/#building-cli-app
 */
export default defineConfig({
  name: '@gateway/common-ts',
  entry: ['src/index.tsx'],
  outDir: 'dist',
  format: ['esm', 'cjs', 'iife'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
