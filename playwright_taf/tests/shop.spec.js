import { test, expect  } from '../fixtures/pageFixtures';
import { getPriceLabelForPrices } from '../utils/helpers';
import testData from './testData';

test.beforeEach(async ({ shopPage }) => {
  await shopPage.open();
  await expect(shopPage.productCards).not.toHaveCount(0);
});

test('[ATMADV-10] Verify default product cards count', async ({ shopPage  }) => {
  await expect(shopPage.page).toHaveTitle(testData.shopPageTitle);
  await expect(shopPage.productCards).toHaveCount(testData.defaultProductsCount);
});

test('[ATMADV-11] Product can be added to cart', async ({ shopPage  }) => {
  await test.step('When product is  added to cart', async () => {
    await shopPage.addProductToCart(testData.products[0].name);
  });

  await test.step('Then the cart should show added product', async () => {
    await expect(shopPage.cart.contentBlock).toBeVisible();
    const productRow = shopPage.getProductRowInCart(testData.products[0].name);
    await expect(productRow.rootEl).toBeVisible();
  });

  await test.step('And the cart should show products counter', async () => {
    await expect(shopPage.cart.counter).toHaveText('1');
  });

  await test.step('When cart is closed', async () => {
    await shopPage.cart.closeButton.click();
    await expect(shopPage.cart.contentBlock).toBeHidden();
  });

  await test.step('Then the cart should show products counter', async () => {
    await expect(shopPage.cart.counter).toHaveText('1');
  });
});

test('[ATMADV-12] Subtotal calculated correctly when products added to cart', async ({ shopPage  }) => {
  let firstProductRow, secondProductRow;

  await test.step('When first product is added to cart', async () => {
    await shopPage.addProductToCart(testData.products[0].name);
    await expect(shopPage.cart.contentBlock).toBeVisible();
  });

  await test.step('And second product is added to cart', async () => {
    await shopPage.addProductToCart(testData.products[1].name);
  });

  await test.step('Then both products should be visible in the cart', async () => {
    firstProductRow = shopPage.getProductRowInCart(testData.products[0].name);
    secondProductRow = shopPage.getProductRowInCart(testData.products[1].name);
    await expect(firstProductRow.rootEl).toBeVisible();
    await expect(secondProductRow.rootEl).toBeVisible();
  });

  await test.step('And product prices should be displayed correctly', async () => {
    await expect(firstProductRow.priceLabel).toHaveText(getPriceLabelForPrices(testData.products[0].price));
    await expect(secondProductRow.priceLabel).toHaveText(getPriceLabelForPrices(testData.products[1].price));
    await expect(shopPage.cart.productRows).toHaveCount(2);
  });

  await test.step('And the cart should show correct products count', async () => {
    await expect(shopPage.cart.counter).toHaveText('2');
  });

  await test.step('Then the subtotal should be calculated correctly', async () => {
    await expect(shopPage.cart.subTotalLabel).toHaveText(getPriceLabelForPrices([testData.products[0].price, testData.products[1].price]));
  });
});


