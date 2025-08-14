import { defineConfig } from 'vitest/config'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const setupDir = path.resolve(__dirname, './vitest-setup');

export default defineConfig({
  test: {
    globals: true,
    setupFiles: path.resolve(setupDir, 'setup.js'),
    globalSetup: path.resolve(setupDir, 'global-setup.js'),
    testTimeout: 30000,
    threads: parseInt(process.env.THREADS || '1', 10),
    teardownTimeout: 20000,
    reporters: [
      "verbose",
      [
        "allure-vitest/reporter",
        {
          resultsDir: path.resolve(__dirname, './artifacts/allure-results'),
        },
      ],
    ],
  },
})
