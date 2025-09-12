import { step } from '../../support/helpers'

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
    return this.rootEl.$('button=+')
  }

  get minusButton () {
    return this.rootEl.$('button=-')
  }

  get priceLabel () {
    return this.rootEl.$('div[class^="CartProduct__Price"] p')
  }

  get removeButton() {
    return this.rootEl.$('button[title="remove product from cart"]')
  }

  get descriptionBlock() {
    return this.rootEl.$('p[class^="CartProduct__Desc"]')
  }

  increaseQuantity () {
    return step(`Increase quantity for "${this.productName}"`, async () => {
      return this.plusButton.click()
    })
  }

  decreaseQuantity () {
    return step(`Decrease quantity for "${this.productName}"`, async () => {
      return this.minusButton.click()
    })
  }

  removeFromCart () {
    return step(`Remove "${this.productName}" from cart`, async () => {
      return this.removeButton.click()
    })
  }
}
