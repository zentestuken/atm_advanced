export default class ProductRowInCart {
  constructor (page, productName) {
    this.rootEl = () => page.locator('[class^="CartProduct__Container"]').filter({ hasText: productName }).first();
  }

  plusButton () { return this.rootEl().locator('button[class^="CartProduct__ChangeQuantity"]').filter({ hasText: '+' }).first(); }
  minusButton () { return this.rootEl().locator('button[class^="CartProduct__ChangeQuantity"]').filter({ hasText: '-' }).first(); }
  priceLabel () { return this.rootEl().locator('div[class^="CartProduct__Price"] p'); }

  increaseQuantity () {
    return this.plusButton().click();
  }

  decreaseQuantity () {
    return this.minusButton().click();
  }
}
