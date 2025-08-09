export default class ProductCard {
  constructor (page, productName) {
    this.rootEl = () => page.locator('[class^="Product__Container"]').filter({ hasText: productName }).first();
  }

  addToCartButton () { return this.rootEl().locator('button[class^="Product__BuyButton"]') };
  priceLabel () { return this.rootEl().locator('div[class^="Product__Price"]') };
}
