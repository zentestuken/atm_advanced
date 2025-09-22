import ProductCard from '../components/productCard.component'
import Cart from '../components/cart.component'
import ProductRowInCart from '../components/productRowInCart.component'
import SizeFilter from '../components/sizeFilter.component'
import { step } from '../../support/helpers'

class ShopPage {
  constructor (browser) {
    this.url = '/'
    this.browser = browser
    this.cart = new Cart(browser)
  }

  get productCards () {
    return this.browser.$$('[class^="Product__Container"]')
  }

  get toggleCartButton () {
    return this.browser.$('button[class^="Cart__CartButton"]')
  }

  open () {
    return step(`Navigate to shop page "${this.url}"`, async () => {
      await this.browser.url(this.url)
    })
  }

  getProductCard (productName) {
    return new ProductCard(this.browser, productName)
  }

  getProductRowInCart (productName) {
    return new ProductRowInCart(this.browser, productName)
  }

  getSizeFilter(size) {
    return new SizeFilter(this.browser, size)
  }
}

export default ShopPage
