import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import playwright from 'eslint-plugin-playwright';

export default defineConfig([
  {
    ...playwright.configs['flat/recommended'],
    files: ["**/*.{js,mjs,ts}"],
      ignores: [
        '**/node_modules/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**//playwright/.cache/**',
        '**/allure-results/**',
        '**/allure-report/**',
        '**/eslint.config.mjs',
        '**/playwright.config.js'
    ],
    plugins: {
      js,
      playwright,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        browser: true,
        context: true,
        page: true,
        test: true,
        expect: true,
      },
    },
    extends: ["js/recommended"],
  },
]);
