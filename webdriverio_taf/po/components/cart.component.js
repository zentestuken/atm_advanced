import { within } from '@testing-library/webdriverio'

class Cart {
  constructor (browser) {
    this.browser = browser
    this.rootEl = () => this.browser.$('[class^="Cart__Container"]')
  }

  async getCloseButton () {
    return within(await this.rootEl()).getByRole('button', { name: 'X' })
  }

  get emptyMessageBlock () {
    return this.rootEl().$('div[class^="CartProducts__CartProductsEmpty"]')
  }

  async getCheckoutButton () {
    return within(await this.rootEl()).getByRole('button', { name: 'Checkout' })
  }

  get subTotalLabel () {
    return this.rootEl().$('[class^="Cart__SubPriceValue"]')
  }

  get contentBlock () {
    return this.rootEl().$('div[class^="Cart__CartContent-"]')
  }

  get productRows () {
    return this.rootEl().$$('[class^="CartProduct__Container"]')
  }

  get counter () {
    return this.rootEl().$('div[class^="Cart__CartQuantity"]')
  }
}

export default Cart