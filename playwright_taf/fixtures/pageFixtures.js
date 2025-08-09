import { test as baseTest } from '@playwright/test';
import ShopPage from '../po/pages/shop.page';

export const test = baseTest.extend({
  shopPage: async ({ page }, use) => {
    const shopPage = new ShopPage(page);
    await use(shopPage);
  },
});

export const expect = test.expect;