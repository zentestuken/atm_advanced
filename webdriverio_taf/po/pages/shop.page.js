// Original Playwright code for reference:
// import ProductCard from "../components/productCard.component";
// import Cart from "../components/cart.component";
// import ProductRowInCart from "../components/productRowInCart.component";
//
// class ShopPage {
//   constructor (page) {
//     this.url = '/'
//     this.page = page
//     this.cart = new Cart(page);
//   }
//
//   open () {
//     return this.page.goto(this.url)
//   }
//
//   get productCards () {
//     return this.page.locator('[class^="Product__Container"]');
//   }
//
//   getProductCard (productName) {
//     return new ProductCard(this.page, productName);
//   }
//
//   getProductRowInCart (productName) {
//     return new ProductRowInCart(this.page, productName);
//   }
//
//   async getProductCounterText () {
//     const locator = this.page.locator(':has-text(" Product(s) found")');
//     const textContent = await locator.textContent();
//     const match = textContent.match(/\d+/);
//     const number = match ? parseInt(match[0], 10) : null;
//     return number;
//   }
//
//   getSizeFilter (size) {
//     return this.page.getByRole('button', { name: size });
//   }
//
//   get getCartCounter () {
//     return this.page.getByTitle('Products in cart quantity');
//   }
//
//   addProductToCart (productName) {
//     const productCard = this.getProductCard(productName);
//     return productCard.addToCartButton.click();
//   }
//
//   hoverOverProductCard (productName) {
//     const productCard = this.getProductCard(productName);
//     return productCard.rootEl.hover();
//   }
//
//   selectSizeFilter (size) {
//     const sizeFilter = this.getSizeFilter(size);
//     return sizeFilter.click();
//   }
//
//   openCart () {
//     return this.page.locator('button[class^="Cart__CartButton"]').click();
//   }
//
//   closeCart () {
//     return this.page.locator('button[class^="Cart__CartButton"]').click();
//   }
// }

// WebdriverIO version:
import ProductCard from "../components/productCard.component";
import Cart from "../components/cart.component";
import ProductRowInCart from "../components/productRowInCart.component";
import { within } from '@testing-library/webdriverio'

class ShopPage {
  constructor (browser) {
    this.url = '/';
    this.browser = browser;
    this.page = () => within(this.browser.$('body'));
    this.cart = new Cart(browser);
  }

  open () {
    return this.browser.url(this.url)
  }

  get productCards () {
    return this.browser.$$('[class^="Product__Container"]');
  }

  getProductCard (productName) {
    return new ProductCard(this.browser, productName);
  }

  getProductRowInCart (productName) {
    return new ProductRowInCart(this.browser, productName);
  }

  async getProductCounterText () {
    const locator = this.browser.$('*=Product(s) found');
    const textContent = await locator.getText();
    const match = textContent.match(/\d+/);
    const number = match ? parseInt(match[0], 10) : null;
    return number;
  }

  getSizeFilter (size) {
    return this.page().getByRole('button', { name: size });
  }

  get getCartCounter () {
    return this.page().getByTitle('Products in cart quantity');
  }

  async addProductToCart (productName) {
    const productCard = this.getProductCard(productName);
    return (await productCard.getAddToCartButton()).click();
  }

  hoverOverProductCard (productName) {
    const productCard = this.getProductCard(productName);
    return productCard.rootEl().moveTo();
  }

  selectSizeFilter (size) {
    const sizeFilter = this.getSizeFilter(size);
    return sizeFilter.click();
  }

  openCart () {
    return this.browser.$('button[class^="Cart__CartButton"]').click();
  }

  closeCart () {
    return this.browser.$('button[class^="Cart__CartButton"]').click();
  }
}

export default ShopPage
