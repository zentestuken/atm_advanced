import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const allureResultsPath = path.join(__dirname, 'artifacts/allure-results');
const serverUrl = 'http://localhost:3000';

const rpConfig = {
  apiKey: process.env.RP_APIKEY,
  endpoint: process.env.RP_ENDPOINT || 'https://reportportal.epam.com/api/v1',
  project: process.env.RP_PROJECT || 'yauhen_viazau_personal',
  launch: process.env.RP_LAUNCH || 'ATM Advanced Auto-Test Run',
  attributes: [
    {
      key: 'project',
      value: 'playwright_taf',
    },
  ],
  description: 'Automated test run',
};

const reporters = [
  ['allure-playwright', {
      resultsDir: 'artifacts/allure-results',
      clearFiles: true, 
    }
  ],
  ["list"],
  ['json', { outputFile: 'artifacts/temp-results.json' }],
];

if (process.env.CI && process.env.RP_APIKEY) {
  reporters.push(['@reportportal/agent-js-playwright', rpConfig]);
}

function clearAllureResults() {
  if (fs.existsSync(allureResultsPath)) {
    fs.rmSync(allureResultsPath, { recursive: true, force: true });
    console.log(`Cleared Allure results directory: ${allureResultsPath}`);
  }
}
clearAllureResults();

export default defineConfig({
  testDir: './tests',
  outputDir: path.join(__dirname, 'artifacts/test-results'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: serverUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: serverUrl,
    cwd: process.env.UI_APP_PATH || path.resolve(__dirname, '../app'),
    reuseExistingServer: !process.env.CI, 
    timeout: 40 * 1000,
  },
});

