import allureReporter from '@wdio/allure-reporter';
import registerCustomCommands from './support/commands.js';

export const config = {
    runner: 'local',

    // For Selenium Grid:
    // hostname: 'localhost',
    // port: 4444,
    // path: '/wd/hub',

    specs: [
        './tests**/*.spec.js'
    ],
 
    maxInstances: 5,

    // commented out params for BrowserStack
    capabilities: [{
      browserName: 'chrome',
      // browserVersion: 'latest',
      'goog:chromeOptions': {
          args: ['--window-size=1920,1080']
      },
      // 'bstack:options': {
      //     os: 'Windows',
      //     osVersion: '10',
      //     local: 'true',
      //     debug: 'true',
      //     seleniumVersion: '4.0.0',
      //     resolution: '1920x1080'
      // },
    }, {
      browserName: 'firefox',
      // browserVersion: 'latest',
      'moz:firefoxOptions': {
          args: ['--width=1920', '--height=1080']
      },
      // 'bstack:options': {
      //     os: 'Windows',
      //     osVersion: '10',
      //     local: 'true',
      //     debug: 'true',
      //     resolution: '1920x1080'
      // },
    }, {
      browserName: 'MicrosoftEdge',
      // browserVersion: 'latest',
      'ms:edgeOptions': {
          args: ['--window-size=1920,1080']
      },
      // 'bstack:options': {
      //     os: 'Windows',
      //     osVersion: '10',
      //     local: 'true',
      //     debug: 'true',
      //     resolution: '1920x1080'
      // },
    }],

    logLevel: 'warn',
 
    bail: 0,

    baseUrl: 'http://localhost:3000',

    waitforTimeout: 10000,

    connectionRetryTimeout: 120000,

    connectionRetryCount: 3,

    //For BrowserStack:
    // services: [
    //   ['browserstack', {
    //     browserstackLocal: true
    //   }]
    // ],
    // user: '',
    // key: '',

    framework: 'mocha',

    reporters: ['spec',
      ['allure', {
        outputDir: 'artifacts/allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        disableMochaHooks: false,
        addConsoleLogs: true,
      }],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    before: async function (capabilities, specs) {
      registerCustomCommands()
    },

    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {object}  test             test object
     * @param {object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {*}       result.result    return object of test function
     * @param {number}  result.duration  duration of test
     * @param {boolean} result.passed    true if test has passed, otherwise false
     * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
      if (!passed) {
        const screenshot = await browser.takeScreenshot();
        allureReporter.addAttachment(
          'Screenshot on Failure',
          Buffer.from(screenshot, 'base64'),
          'image/png'
        );
      }
    },
}
