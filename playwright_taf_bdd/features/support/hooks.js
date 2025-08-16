import { Before, After } from '@cucumber/cucumber';
import ShopPage from '../../po/pages/shop.page.js';

Before(async function () {
  // eslint-disable-next-line no-console
  console.log('Opening Shop page...');
  await this.openBrowser();
  this.shopPage = new ShopPage(this.page, this.baseUrl);
  await this.shopPage.open();
});

After(async function () {
  await this.closeBrowser();
});