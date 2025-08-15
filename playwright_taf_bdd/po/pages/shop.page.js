import ProductCard from "../components/productCard.component";
import Cart from "../components/cart.component";
import ProductRowInCart from "../components/productRowInCart.component";

class ShopPage {
  constructor (page) {
    this.url = '/'
    this.page = page
    this.cart = new Cart(page);
  }

  open () {
    return this.page.goto(this.url)
  }

  get productCards () {
    return this.page.locator('[class^="Product__Container"]');
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
    return this.page.getByRole('button', { name: size });
  }

  get getCartCounter () {
    return this.page.getByTitle('Products in cart quantity');
  }

  addProductToCart (productName) {
    const productCard = this.getProductCard(productName);
    return productCard.addToCartButton.click();
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
