class ProductCard {
  constructor(page, productName) {
    this.rootEl = page.locator('[class^="Product__Container"]').filter({ hasText: productName }).first();
  }

  get addToCartButton() {
    return this.rootEl.getByRole('button', { name: 'Add to cart' });
  }
  get priceLabel() {
    return this.rootEl.locator('div[class^="Product__Price"]');
  }
}

module.exports = ProductCard;
