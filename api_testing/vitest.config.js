import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.test.js'],
    reporters: ['default', 'html'],
    threads: true,
    maxThreads: 2,
  },
})
