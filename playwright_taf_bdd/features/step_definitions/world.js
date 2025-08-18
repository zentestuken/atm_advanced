const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
var { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(15 * 1000);
class CustomWorld {
  constructor({ attach }) {
    this.browser = null;
    this.page = null;
    this.context = {};
    this.baseUrl = 'http://localhost:3000';
    this.attach = attach;
  }

  async openBrowser() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(30000);
  }

  async closeBrowser() {
    await this.page?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);