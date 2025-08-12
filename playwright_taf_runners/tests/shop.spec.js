import { expect } from '@playwright/test';
import { context } from './setup.js';
import testData from './testData';

let shopPage;
let page;

beforeEach(() => {
  ({ shopPage, page } = context);
});

test('Verify default product cards count', async () => {
  await shopPage.open();
  await expect(shopPage.productCards).not.toHaveCount(0);
  await expect(page).toHaveTitle(testData.shopPageTitle);
  await expect(shopPage.productCards).toHaveCount(testData.defaultProductsCount);
});

test('Product can be added to cart', async () => {
  await shopPage.open();
  await expect(shopPage.productCards).not.toHaveCount(0);
  await shopPage.addProductToCart(testData.products[0].name);
  await expect(shopPage.cart.contentBlock).toBeVisible();
  const productRow = shopPage.getProductRowInCart(testData.products[0].name);
  await expect(productRow.rootEl).toBeVisible();
  await expect(shopPage.cart.counter).toHaveText('1');
  await shopPage.cart.closeButton.click();
  await expect(shopPage.cart.contentBlock).toBeHidden();
  await expect(shopPage.getCartCounter).toHaveText('1');
});
