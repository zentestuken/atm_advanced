import { test, expect  } from '../fixtures/pageFixtures';

const testData = {
  defaultProductsCount: 16,
  shoppPageTitle: 'Typescript React Shopping cart',
  productToAdd: 'Skater Black Sweatshirt',
};

test('Verify default product cards count', async ({ shopPage  }) => {
  await shopPage.open();
  await expect(shopPage.page).toHaveTitle(testData.shoppPageTitle);
  const cardsCount = await shopPage.getProductCardsCount();
  expect(cardsCount).toEqual(testData.defaultProductsCount);
});

test('Product can be added to cart', async ({ shopPage  }) => {
  await shopPage.open();
  await shopPage.checkLoaded();
  await shopPage.addProductToCart(testData.productToAdd);
  await shopPage.cart.checkLoaded();
  const productRow = shopPage.getProductRowInCart(testData.productToAdd);
  await expect(productRow.rootEl()).toBeVisible();
  const cartCounterText = await shopPage.cart.getCounterText();
  expect(cartCounterText).toEqual('1');
  await shopPage.cart.closeButton().click();
  await shopPage.cart.checkClosed();
  expect(await shopPage.getCartCounterText()).toEqual('1');
});
