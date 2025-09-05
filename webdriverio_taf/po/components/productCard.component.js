import { within } from '@testing-library/webdriverio'

export default class ProductCard {
  constructor (browser, productName) {
    this.browser = browser
    this.rootEl = () => this.browser.$$('[class^="Product__Container"]').find(async (el) => {
      const text = await el.getText()
      return text.includes(productName)
    })
  }

  async getAddToCartButton () {
    return within(await this.rootEl()).getByRole('button', { name: 'Add to cart' })
  }

  get priceLabel () {
    return this.rootEl().$('div[class^="Product__Price"]')
  }
}
