import ProductCard from '../components/productCard.component'
import Cart from '../components/cart.component'
import ProductRowInCart from '../components/productRowInCart.component'
import SizeFilter from '../components/sizeFilter.component'

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
    return this.browser.url(this.url)
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

  async addProductToCart (productName) {
    const productCard = this.getProductCard(productName)
    return (await productCard.addToCartButton).click()
  }

  async hoverOverProductCard (productName) {
    const productCard = this.getProductCard(productName)
    return (await productCard.rootEl).moveTo()
  }

  selectSizeFilter (size) {
    const sizeFilter = this.getSizeFilter(size)
    return sizeFilter.click()
  }

  toggleCart ({ highlight = false } = {}) {
    if (highlight) return this.toggleCartButton.highlightAndClick()
    return this.toggleCartButton.click()
  }
}

export default ShopPage
