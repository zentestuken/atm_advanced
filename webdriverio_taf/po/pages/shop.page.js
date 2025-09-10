import ProductCard from '../components/productCard.component'
import Cart from '../components/cart.component'
import ProductRowInCart from '../components/productRowInCart.component'
import { within } from '@testing-library/webdriverio'
import SizeFilter from '../components/sizeFilter.component'

class ShopPage {
  constructor (browser) {
    this.url = '/'
    this.browser = browser
    this.page = () => within(this.browser.$('body'))
    this.cart = new Cart(browser)
  }

  open () {
    return this.browser.url(this.url)
  }

  get productCards () {
    return this.browser.$$('[class^="Product__Container"]')
  }

  getProductCard (productName) {
    return new ProductCard(this.browser, productName)
  }

  getProductRowInCart (productName) {
    return new ProductRowInCart(this.browser, productName)
  }

  async getProductCounterText () {
    const locator = this.browser.$('*=Product(s) found')
    const textContent = await locator.getText()
    const match = textContent.match(/\d+/)
    const number = match ? parseInt(match[0], 10) : null
    return number
  }

  getSizeFilter(size) {
    return new SizeFilter(this.browser, size)
  }

  get getCartCounter () {
    return this.page().getByTitle('Products in cart quantity')
  }

  async addProductToCart (productName) {
    const productCard = this.getProductCard(productName)
    return (await productCard.getAddToCartButton()).click()
  }

  hoverOverProductCard (productName) {
    const productCard = this.getProductCard(productName)
    return productCard.rootEl().moveTo()
  }

  selectSizeFilter (size) {
    const sizeFilter = this.getSizeFilter(size)
    return sizeFilter.click()
  }

  toggleCart ({ highlight = false } = {}) {
    if (highlight) return this.browser.$('button[class^="Cart__CartButton"]').highlightAndClick()
    return this.browser.$('button[class^="Cart__CartButton"]').click()
  }
}

export default ShopPage
