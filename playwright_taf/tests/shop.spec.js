import { test, expect  } from '../fixtures/pageFixtures';
import { getPriceLabelForPrices } from '../utils/helpers';
import testData from './testData';

test('Verify default product cards count', async ({ shopPage  }) => {
  await shopPage.open();
  await shopPage.checkLoaded();
  await expect(shopPage.page).toHaveTitle(testData.shopPageTitle);
  const cardsCount = await shopPage.getProductCardsCount();
  expect(cardsCount).toEqual(testData.defaultProductsCount);
});

test('Product can be added to cart', async ({ shopPage  }) => {
  await shopPage.open();
  await shopPage.checkLoaded();
  await shopPage.addProductToCart(testData.products[0].name);
  await shopPage.cart.checkLoaded();
  const productRow = shopPage.getProductRowInCart(testData.products[0].name);
  await expect(productRow.rootEl()).toBeVisible();
  expect(await shopPage.cart.getCounterText()).toEqual('1');
  await shopPage.cart.closeButton().click();
  await shopPage.cart.checkClosed();
  expect(await shopPage.getCartCounterText()).toEqual('1');
});

test('Subtotal calculated correctly when products added to cart', async ({ shopPage  }) => {
  await shopPage.open();
  await shopPage.checkLoaded();
  await shopPage.addProductToCart(testData.products[0].name);
  await shopPage.cart.checkLoaded();
  await shopPage.addProductToCart(testData.products[1].name);
  const firstProductRow = shopPage.getProductRowInCart(testData.products[0].name);
  const secondProductRow = shopPage.getProductRowInCart(testData.products[1].name);
  await expect(firstProductRow.rootEl()).toBeVisible();
  await expect(secondProductRow.rootEl()).toBeVisible();
  await expect(firstProductRow.priceLabel()).toHaveText(getPriceLabelForPrices(testData.products[0].price));
  await expect(secondProductRow.priceLabel()).toHaveText(getPriceLabelForPrices(testData.products[1].price));
  expect(await shopPage.cart.getCounterText()).toEqual('2');
  await expect(shopPage.cart.subTotalLabel()).toHaveText(getPriceLabelForPrices([testData.products[0].price, testData.products[1].price]));
  aaa
});


