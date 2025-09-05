import { within } from '@testing-library/webdriverio'

export default class ProductRowInCart {
  constructor (browser, productName) {
    this.browser = browser
    this.rootEl = () => this.browser.$$('[class^="CartProduct__Container"]').find(async (el) => {
      const text = await el.getText()
      return text.includes(productName)
    })
  }

  async getPlusButton() {
    return within(await this.rootEl()).getByRole('button', { name: '+' })
  }

  async getMinusButton () {
    return within(await this.rootEl()).getByRole('button', { name: '-' })
  }

  get priceLabel () {
    return this.rootEl().$('div[class^="CartProduct__Price"] p')
  }

  get removeButton() {
    return this.rootEl().$('button[title="remove product from cart"]')
  }

  get descriptionBlock() { return this.rootEl().$('p[class^="CartProduct__Desc"]') }

  async increaseQuantity () {
    return (await this.getPlusButton()).click()
  }

  async decreaseQuantity () {
    return (await this.getMinusButton()).click()
  }
}
