const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { 
  getPriceLabelForPrices,
} = require('../../utils/helpers');

Then('{int} product cards should be shown', async function (productCardsCount) {
  await expect(this.shopPage.productCards).toHaveCount(productCardsCount);
});

Then('the page should have {string} title', async function (pageTitle) {
  await expect(this.page).toHaveTitle(pageTitle);
});

Then(/^the cart should( not)? show added product "([^"]+)"$/, async function (notKeyword, productName) {
  const productRow = this.shopPage.getProductRowInCart(productName);
  if (notKeyword) await expect(productRow.rootEl).not.toBeVisible();
  else await expect(productRow.rootEl).toBeVisible();
});

Then('the cart product counter should show {string}', async function (counterText) {
  await expect(this.shopPage.cart.counter).toHaveText(counterText);
});

Then(/^the cart should be (open|closed)$/, async function (cartStatus) {
  if (cartStatus === 'open') await expect(this.shopPage.cart.contentBlock).toBeVisible();
  else await expect(this.shopPage.cart.contentBlock).toBeHidden();
});

Then('the cart should have {int} product rows', async function (productRowsCount) {
  await expect(this.shopPage.cart.productRows).toHaveCount(productRowsCount);
});

Then('{string} product row should have price {string}', async function (productName, price) {
  const productRow = this.shopPage.getProductRowInCart(productName);
  await expect(productRow.priceLabel).toHaveText(getPriceLabelForPrices(price));
});

Then('the cart subtotal should be {string}', async function (subtotal) {
  await expect(this.shopPage.cart.subTotalLabel).toHaveText(getPriceLabelForPrices(subtotal));
});

Then('checkout alert is shown with correct message', async function () {
  await this.context.checkoutAlert;
});

Then('{string} product row should have quantity {string}', async function (productName, quantity) {
  const productRow = this.shopPage.getProductRowInCart(productName);
  await expect(productRow.descriptionBlock).toHaveText(new RegExp(`Quantity: ${quantity}$`));
});

Then('the following product cards shown:', async function (productNamesList) {
  const productNames = productNamesList.split('\n').map(product => product.trim());
  for (const productName of productNames) {
    const productCard = this.shopPage.getProductCard(productName);
    await expect(productCard.rootEl).toBeVisible();
  };
});
