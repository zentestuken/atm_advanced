import { expect } from '@playwright/test';
import { context } from './setup.js';
import { getPriceLabelForPrices, handleCheckoutAlert } from '../utils/helpers.js';
import testData from './testData.js';

let shopPage;
let page;

beforeEach(() => {
  ({ shopPage, page } = context);
});

test('Subtotal calculated correctly when products added to cart', async () => {
  await shopPage.open();
  await expect(shopPage.productCards).not.toHaveCount(0);
  await shopPage.addProductToCart(testData.products[0].name);
  await expect(shopPage.cart.contentBlock).toBeVisible();
  await shopPage.addProductToCart(testData.products[1].name);
  const firstProductRow = shopPage.getProductRowInCart(testData.products[0].name);
  const secondProductRow = shopPage.getProductRowInCart(testData.products[1].name);
  await expect(firstProductRow.rootEl).toBeVisible();
  await expect(secondProductRow.rootEl).toBeVisible();
  await expect(firstProductRow.priceLabel).toHaveText(getPriceLabelForPrices(testData.products[0].price));
  await expect(secondProductRow.priceLabel).toHaveText(getPriceLabelForPrices(testData.products[1].price));
  await expect(shopPage.cart.productRows).toHaveCount(2);
  await expect(shopPage.cart.counter).toHaveText('2');
  await expect(shopPage.cart.subTotalLabel).toHaveText(getPriceLabelForPrices([testData.products[0].price, testData.products[1].price]));
});

test('Verify checkout alert with one product', async () => {
  const checkoutAlert = handleCheckoutAlert(page, testData.products[0].price);
  await shopPage.open();
  await expect(shopPage.productCards).not.toHaveCount(0);
  await shopPage.addProductToCart(testData.products[0].name);
  await expect(shopPage.cart.contentBlock).toBeVisible();
  const productRow = shopPage.getProductRowInCart(testData.products[0].name);
  await expect(productRow.rootEl).toBeVisible();
  await shopPage.cart.checkoutButton.click();
  await checkoutAlert;
});

