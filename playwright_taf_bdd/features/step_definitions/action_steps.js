const { Given, When } = require('@cucumber/cucumber');
const { 
  handleCheckoutAlert,
} = require('../../utils/helpers');

Given('the user is on the Shop page', async function() {
  await this.shopPage.open();
});

When('the product {string} is added to cart', async function (productName) {
  await this.shopPage.addProductToCart(productName);
});

When('the user closes the cart', async function () {
  await this.shopPage.cart.closeButton.click();
});

When('checkout button is clicked with subtotal of {string}', async function (subtotal) {
  this.context.checkoutAlert = handleCheckoutAlert(this.shopPage.page, subtotal);
  await this.shopPage.cart.checkoutButton.click();
});

When('the product {string} is removed from the cart', async function (productName) {
  const productRow = this.shopPage.getProductRowInCart(productName);
  await productRow.removeButton.click();
});

When('the user clicks plus button for {string} product row', async function (productName) {
  const productRow = this.shopPage.getProductRowInCart(productName);
  await productRow.increaseQuantity();
});
