import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { chromium } from '@playwright/test';
import ShopPage from '../po/pages/shop.page';

let browser;
const context = {};
const baseUrl = 'http://localhost:3000';

beforeAll(async () => {
  browser = await chromium.launch();
});

beforeEach(async () => {
  context.page = await browser.newPage();
  context.shopPage = new ShopPage(context.page, baseUrl);
});

afterEach(async () => {
  await context.page.close();
});

afterAll(async () => {
  await browser.close();
});

export { context };