import { test, expect  } from '../fixtures/pageFixtures';
import { getPriceLabelForPrices } from '../utils/helpers';
import testData from './testData';

test.beforeEach(async ({ shopPage }) => {
  await shopPage.open();
  await expect(shopPage.productCards).not.toHaveCount(0);
});

test('Verify default product cards count', async ({ shopPage  }) => {
  await expect(shopPage.page).toHaveTitle(testData.shopPageTitle);
  await expect(shopPage.productCards).toHaveCount(testData.defaultProductsCount);
});

test('Product can be added to cart', async ({ shopPage  }) => {
  await shopPage.addProductToCart(testData.products[0].name);
  await expect(shopPage.cart.contentBlock).toBeVisible();
  const productRow = shopPage.getProductRowInCart(testData.products[0].name);
  await expect(productRow.rootEl).toBeVisible();
  await expect(shopPage.cart.counter).toHaveText('1');
  await shopPage.cart.closeButton.click();
  await expect(shopPage.cart.contentBlock).toBeHidden();
  await expect(shopPage.getCartCounter).toHaveText('1');
});

test('Subtotal calculated correctly when products added to cart', async ({ shopPage  }) => {
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


