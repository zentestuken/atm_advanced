import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
// import { getPriceLabelForPrices, handleCheckoutAlert } from '../../utils/helpers';

Then('the {int} product cards should be shown', async function (productCardsCount) {
  await expect(this.shopPage.productCards).toHaveCount(productCardsCount);
});

Then('the page should have {string} title', async function (pageTitle) {
  await expect(this.page).toHaveTitle(pageTitle);
});

When('the product {string} is added to cart', async function (productName) {
  await this.shopPage.addProductToCart(productName);
});

Then('the cart should show added product {string}', async function (productName) {
    const productRow = this.shopPage.getProductRowInCart(productName);
    await expect(productRow.rootEl).toBeVisible();
});

Then('the cart product counter should show {string}', async function (counterText) {
    await expect(this.shopPage.cart.counter).toHaveText(counterText);
});

When('the user closes the cart', async function () {
    await this.shopPage.cart.closeButton.click();
});

Then(/^the cart should be (open|closed)$/, async function (cartStatus) {
    if (cartStatus === 'open') await expect(this.shopPage.cart.contentBlock).toBeVisible();
    else await expect(this.shopPage.cart.contentBlock).toBeHidden();
});
