import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { chromium } from '@playwright/test';
import ShopPage from '../po/pages/shop.page';
import { baseUrl } from './global-setup';

let browser;
const context = {};

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