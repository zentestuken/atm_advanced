const ADD_BUTTON_TEXT = 'Add to cart'
export default class ProductCard {
  constructor (browser, productName) {
    this.browser = browser
    this.productName = productName
  }

  get rootEl () {
    return this.browser
      .$('//div[starts-with(@class, "Product__Container") and ' +
        `.//p[text()="${this.productName}"]]`)
  }

  get addToCartButton () {
    return this.rootEl.$(`button=${ADD_BUTTON_TEXT}`)
  }

  get priceLabel () {
    return this.rootEl.$('div[class^="Product__Price"]')
  }

  get image () {
    return this.rootEl.$('div[class^="Product__Image"]')
  }
}
