class Cart {
  constructor(page) {
    this.rootEl = page.locator('[class^="Cart__Container"]');
  }

  get closeButton() { return this.rootEl.getByRole('button', { name: 'X' }); }
  get emptyMessageBlock() {
    return this.rootEl.locator('div[class^="CartProducts__CartProductsEmpty"]');
  }
  get checkoutButton() { return this.rootEl.getByRole('button', { name: 'Checkout' }); }
  get subTotalLabel() { return this.rootEl.locator('[class^="Cart__SubPriceValue"]'); }

  get contentBlock() {
    return this.rootEl.locator('div[class^="Cart__CartContent-"]');
  }
  get productRows() {
    return this.rootEl.locator('[class^="CartProduct__Container"]');
  }
  get counter() {
    return this.rootEl.locator('div[class^="Cart__CartQuantity"]');
  }
}

module.exports = Cart;