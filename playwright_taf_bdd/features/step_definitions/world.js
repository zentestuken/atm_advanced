import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium } from 'playwright';

class CustomWorld {
  constructor() {
    this.browser = null;
    this.page = null;
    this.context = {};
    this.baseUrl = 'http://localhost:3000';
  }

  async openBrowser() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(30000);
  }

  async closeBrowser() {
    await this.page?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);