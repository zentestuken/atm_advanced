export default class ProductCard {
  constructor (browser, productName) {
    this.browser = browser
    this.productName = productName
  }

  async rootEl () {
    const elements = await this.browser.$$('[class^="Product__Container"]')
    for (const el of elements) {
      const text = await el.getText()
      if (text.includes(this.productName)) {
        return el
      }
    }
    throw new Error(`Product "${this.productName}" not found`)
  }

  async getAddToCartButton () {
    return (await this.rootEl()).$('button=Add to cart')
  }

  async getPriceLabel () {
    return (await this.rootEl()).$('div[class^="Product__Price"]')
  }
}
