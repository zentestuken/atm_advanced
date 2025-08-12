import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import playwright from 'eslint-plugin-playwright';
import vitest from 'eslint-plugin-vitest';

export default defineConfig([
  {
    ...playwright.configs['flat/recommended'],
    files: ["**/*.{js,mjs,ts}"],
      ignores: [
        '**/node_modules/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/playwright/.cache/**',
        '**/artifacts/**',
        '**/eslint.config.mjs',
        '**/playwright.config.js',
        '../*',
    ],
    plugins: {
      js,
      playwright,
      vitest,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        browser: true,
        context: true,
        page: true,
        test: true,
        expect: true,
        process: true,
        beforeEach: 'readonly',
        afterEach: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
      },
    },
    extends: ["js/recommended"],
    rules: {
      'no-console': 'warn',
      'playwright/no-skipped-test': 'error',
      'playwright/no-focused-test': 'error',
    },
  },
]);
