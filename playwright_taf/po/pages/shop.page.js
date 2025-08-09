import ProductCard from "../components/productCard.component";
import Cart from "../components/cart.component";
import ProductRowInCart from "../components/productRowInCart.component";
import { waitForElement } from "../../utils/helpers";

class ShopPage {
  constructor (page) {
    this.url = '/'
    this.page = page
    this.cart = new Cart(page);
  }

  open () {
    return this.page.goto(this.url)
  }

  checkLoaded () {
    return waitForElement(this.page.locator('[class^="Product__Container"]').first());
  }

  getProductCardsCount () {
    const cards = this.page.locator('[class^="Product__Container"]');
    return cards.count();
  }

  getProductCard (productName) {
    return new ProductCard(this.page, productName);
  }

  getProductRowInCart (productName) {
    return new ProductRowInCart(this.page, productName);
  }

  async getProductCounterText () {
    const locator = this.page.locator(':has-text(" Product(s) found")');
    const textContent = await locator.textContent();
    const match = textContent.match(/\d+/);
    const number = match ? parseInt(match[0], 10) : null;
    return number;
  }

  getSizeFilter (size) {
    return this.page.locator('[class^="Filter__Checkbox"]').filter({ hasText: size })[0];
  }

  getCartCounterText () {
    const locator = this.page.locator('[title="Products in cart quantity"]');
    return locator.textContent();
  }

  addProductToCart (productName) {
    const productCard = this.getProductCard(productName);
    return productCard.addToCartButton().click();
  }

  hoverOverProductCard (productName) {
    const productCard = this.getProductCard(productName);
    return productCard.rootEl.hover();
  }

  selectSizeFilter (size) {
    const sizeFilter = this.getSizeFilter(size);
    return sizeFilter.click();
  }

  openCart () {
    return this.page.locator('button[class^="Cart__CartButton"]').click();
  }

  closeCart () {
    return this.page.locator('button[class^="Cart__CartButton"]').click();
  }
}

export default ShopPage
