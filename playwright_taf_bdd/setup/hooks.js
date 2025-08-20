/* eslint-disable no-console */
const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const ShopPage = require('../po/pages/shop.page.js');
const path = require('path');
const { ContentType } = require("allure-js-commons");
const allure = require("allure-js-commons");
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const http = require('http');

const baseUrl = process.env.BASEURL;
let serverProcess = null;

async function checkServerRunning(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.end();
  });
}

Before(async function () {
  await this.openBrowser();
  this.shopPage = new ShopPage(this.page, this.baseUrl);
});

After(async function (testCase) {
  try {
    if (testCase.result.status === Status.FAILED) {
      if (this.page) {
        const screenshotPath = path.resolve(
          __dirname,
          `../artifacts/screenshots/${testCase.pickle.name.replace(/ /g, '_')}.png`
        );
        await this.page.screenshot({ path: screenshotPath });

        if (allure) {
          allure.attachmentPath(
            'Screenshot',
            screenshotPath,
            {
              contentType: ContentType.PNG,
              fileExtension: "png",
            }
          );
        }
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

BeforeAll(async function () {
  const appPath = path.resolve(__dirname, '../../app');

  if (process.env.SERVER_STARTED) {
    console.log('Server is already running (environment variable detected).');
    return;
  }

  const isServerRunning = await checkServerRunning(baseUrl);

  if (isServerRunning) {
    console.log('Server is already running!');
    process.env.SERVER_STARTED = 'true';
  } else {
    console.log('Starting the web server...');
    serverProcess = spawn('npm', ['run', 'start'], {
      cwd: appPath,
      stdio: 'inherit',
      shell: true,
    });

    try {
      await waitOn({
        resources: [baseUrl],
        timeout: 40 * 1000, // 40 seconds timeout
      });
      console.log('Web server is ready!');
      process.env.SERVER_STARTED = 'true';
    } catch (error) {
      throw new Error('Web server startup failed.' + '\n' + error.message);
    }
  }
});

AfterAll(async function () {
  if (serverProcess) {
      console.log('Stopping the web server...');
      try {
        serverProcess.kill('SIGTERM');
        serverProcess.stdout?.destroy();
        serverProcess.stderr?.destroy();

        // Wait for the process to exit
        await new Promise((resolve, reject) => {
          serverProcess.on('exit', () => {
            console.log('Server process exited.');
            resolve();
          });
          serverProcess.on('error', (error) => {
            reject(error);
          });
        });

        delete process.env.SERVER_STARTED;
      } catch (error) {
        console.error('Failed to stop the web server:', error);
      }
  } else {
    console.log('No server process to stop (server was already running).');
  }
});
