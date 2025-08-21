/* eslint-disable no-console */
const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const PageManager = require('../po/pages');
const path = require('path');
const { ContentType } = require("allure-js-commons");
const allure = require("allure-js-commons");
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const fs = require('fs');
const config = require('../config');

let serverProcess = null;

const SERVER_LOCK_FILE = path.resolve(__dirname, '../artifacts/server.lock');

const artifactsDir = path.dirname(SERVER_LOCK_FILE);
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

process.on('exit', () => {
  if (isMyServerLock()) {
    removeServerLock();
  }
});

process.on('SIGINT', () => {
  if (isMyServerLock()) {
    removeServerLock();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (isMyServerLock()) {
    removeServerLock();
  }
  process.exit(0);
});

function isServerLocked() {
  return fs.existsSync(SERVER_LOCK_FILE);
}

function createServerLock() {
  try {
    const lockData = {
      pid: process.pid,
      timestamp: Date.now()
    };
    fs.writeFileSync(SERVER_LOCK_FILE, JSON.stringify(lockData), { flag: 'wx' });
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') {
      return false;
    }
    return false;
  }
}

function removeServerLock() {
  try {
    if (fs.existsSync(SERVER_LOCK_FILE)) {
      fs.unlinkSync(SERVER_LOCK_FILE);
    }
  } catch (error) {
    console.warn('Failed to remove server lock:', error.message);
  }
}

function isMyServerLock() {
  try {
    if (!fs.existsSync(SERVER_LOCK_FILE)) return false;
    const lockData = JSON.parse(fs.readFileSync(SERVER_LOCK_FILE, 'utf8'));
    return lockData.pid === process.pid;
  } catch {
    return false;
  }
}

// Wait for startup triggered by another worker
async function waitForServerStartup(maxWaitTime = config.timeouts.serverStart + 5000) {
  const startTime = Date.now();
  const checkInterval = 1000;
  
  while (Date.now() - startTime < maxWaitTime) {
    const isRunning = await checkServerRunning(config.baseUrl);
    if (isRunning) {
      return true;
    }
    if (!isServerLocked()) {
      return false;
    }
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  return false;
}

async function checkServerRunning(url, timeout = config.timeouts.serverCheck) {
  try {
    await waitOn({
      resources: [url],
      timeout: timeout,
      interval: 500,
    });
    return true;
  } catch {
    return false;
  }
}

async function takeScreenshot(page, testCaseName) {
  const screenshotPath = path.resolve(
    __dirname,
    `../artifacts/screenshots/${testCaseName.replace(/ /g, '_')}.png`
  );
  await page.screenshot({ path: screenshotPath });
  return screenshotPath;
}

function attachScreenshot(allure, screenshotPath) {
  allure.attachmentPath(
    'Screenshot',
    screenshotPath,
    {
      contentType: ContentType.PNG,
      fileExtension: "png",
    }
  );
}

Before(async function () {
  await this.openBrowser();
  this.pageManager = new PageManager(this.page);
  this.shopPage = this.pageManager.get('Shop');
});

After(async function (testCase) {
  try {
    if (testCase.result.status === Status.FAILED && this.page) {
      const screenshotPath = await takeScreenshot(this.page, testCase.pickle.name);

      if (allure) {
        attachScreenshot(allure, screenshotPath);
      }
    }
  } catch (error) {
    console.error(`Error in After hook: ${error.message}`);
  } finally {
    if (this.browser) {
      await this.browser.close();
    }
  }
});

BeforeAll({ timeout: 60_000 }, async function () {
  const appPath = path.resolve(__dirname, '../../app');

  let isServerRunning = await checkServerRunning(config.baseUrl);

  if (isServerRunning) {
    return;
  }

  if (!createServerLock()) {
    const success = await waitForServerStartup();
    if (!success) {
      throw new Error('Server startup by another worker failed or timed out');
    }
    return;
  }

  try {
    serverProcess = spawn('npm', ['run', 'start'], {
      cwd: appPath,
      stdio: 'inherit',
      shell: true,
    });

    isServerRunning = await checkServerRunning(config.baseUrl, config.timeouts.serverStart);

    if (!isServerRunning) {
      removeServerLock();
      throw new Error('Web server did not start within the expected time');
    }
  } catch (error) {
    removeServerLock();
    throw error;
  }
});

AfterAll(async function () {
  if (serverProcess && isMyServerLock()) {
    try {
      serverProcess.kill('SIGTERM');
      
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          try {
            serverProcess.kill('SIGKILL');
          } catch {
            // Process might already be dead
          }
          resolve();
        }, 5000);

        serverProcess.on('exit', () => {
          clearTimeout(timeout);
          resolve();
        });
        
        serverProcess.on('error', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      try {
        serverProcess.stdout?.destroy();
        serverProcess.stderr?.destroy();
      } catch {
        // Streams might already be destroyed
      }

      removeServerLock();
    } catch (error) {
      console.error('Failed to stop the web server:', error);
      removeServerLock();
    }
  } else if (isMyServerLock()) {
    removeServerLock();
  }
});
