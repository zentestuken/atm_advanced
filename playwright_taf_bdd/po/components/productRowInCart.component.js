class ProductRowInCart {
  constructor(page, productName) {
    this.rootEl = page.locator('[class^="CartProduct__Container"]').filter({ hasText: productName }).first();
  }

  get plusButton() { return this.rootEl.getByRole('button', { name: '+' }); }
  get minusButton() { return this.rootEl.getByRole('button', { name: '-' }); }
  get priceLabel() { return this.rootEl.locator('div[class^="CartProduct__Price"] p'); }
  get removeButton() { return this.rootEl.getByTitle('remove product from cart'); }
  get descriptionBlock() { return this.rootEl.locator('p[class^="CartProduct__Desc"]'); }

  increaseQuantity() {
    return this.plusButton.click();
  }

  decreaseQuantity() {
    return this.minusButton.click();
  }
}

module.exports = ProductRowInCart;
