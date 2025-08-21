const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { setDefaultTimeout } = require('@cucumber/cucumber');
const config = require('../config');

setDefaultTimeout(config.timeouts.step); // Cucumber step timeout
class CustomWorld {
  constructor({ attach }) {
    this.browser = null;
    this.page = null;
    this.context = {};
    this.attach = attach;
  }

  async openBrowser() {
    this.browser = await chromium.launch(config.browserOptions);
    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(config.timeouts.command); // Playright command timeout
  }

  async closeBrowser() {
    await this.page?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);