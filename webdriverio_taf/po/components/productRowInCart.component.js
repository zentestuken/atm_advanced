const REMOVE_BUTTON_TOOLTIP = 'remove product from cart'
const PLUS_BUTTON_TEXT = '+'
const MINUS_BUTTON_TEXT = '-'

export default class ProductRowInCart {
  constructor (browser, productName) {
    this.browser = browser
    this.productName = productName
  }

  get rootEl () {
    return this.browser
      .$('//div[starts-with(@class, "CartProduct__Container") and ' +
        `.//p[text()="${this.productName}"]]`)
  }

  get plusButton() {
    return this.rootEl.$(`button=${PLUS_BUTTON_TEXT}`)
  }

  get minusButton () {
    return this.rootEl.$(`button=${MINUS_BUTTON_TEXT}`)
  }

  get priceLabel () {
    return this.rootEl.$('div[class^="CartProduct__Price"] p')
  }

  get removeButton() {
    return this.rootEl.$(`button[title="${REMOVE_BUTTON_TOOLTIP}"]`)
  }

  get descriptionBlock() {
    return this.rootEl.$('p[class^="CartProduct__Desc"]')
  }
}
