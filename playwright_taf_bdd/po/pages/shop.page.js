const ProductCard = require("../components/productCard.component.js");
const Cart = require("../components/cart.component.js");
const ProductRowInCart = require("../components/productRowInCart.component.js");
const SizeFilter = require("../components/sizeFilter.component.js");

class ShopPage {
  constructor(page, baseUrl) {
    this.url = '/';
    this.baseUrl = baseUrl;
    this.page = page;
    this.cart = new Cart(page);
  }

  open() {
    return this.page.goto(`${this.baseUrl}${this.url}`);
  }

  get productCards() {
    return this.page.locator('[class^="Product__Container"]');
  }

  getProductCard(productName) {
    return new ProductCard(this.page, productName);
  }

  getProductRowInCart(productName) {
    return new ProductRowInCart(this.page, productName);
  }

  async getProductCounterText() {
    const locator = this.page.locator(':has-text(" Product(s) found")');
    const textContent = await locator.textContent();
    const match = textContent.match(/\d+/);
    const number = match ? parseInt(match[0], 10) : null;
    return number;
  }

  getSizeFilter(size) {
    // return this.page.locator('[class^="Filter__Container"]').getByRole('checkbox').filter({ hasText: size }).first();
    return new SizeFilter(this.page, size);
  }

  addProductToCart(productName) {
    const productCard = this.getProductCard(productName);
    return productCard.addToCartButton.click();
  }

  hoverOverProductCard(productName) {
    const productCard = this.getProductCard(productName);
    return productCard.rootEl.hover();
  }

  selectSizeFilter(size) {
    const sizeFilter = this.getSizeFilter(size);
    return sizeFilter.click();
  }

  openCart() {
    return this.page.locator('button[class^="Cart__CartButton"]').click();
  }

  closeCart() {
    return this.page.locator('button[class^="Cart__CartButton"]').click();
  }
}

module.exports = ShopPage;
