import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: './tests/setup.js',
    testTimeout: 30000,
    threads: parseInt(process.env.THREADS || '1', 10),
  },
})
