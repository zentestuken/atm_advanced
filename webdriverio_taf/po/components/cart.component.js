const CHECKOUT_BUTTON_TEXT = 'Checkout'

class Cart {
  constructor (browser) {
    this.browser = browser
  }

  get rootEl () {
    return this.browser.$('[class^="Cart__Container"]')
  }

  get emptyMessageBlock () {
    return this.rootEl.$('div[class^="CartProducts__CartProductsEmpty"]')
  }

  get checkoutButton () {
    return this.rootEl.$(`button=${CHECKOUT_BUTTON_TEXT}`)
  }

  get subTotalLabel () {
    return this.rootEl.$('[class^="Cart__SubPriceValue"]')
  }

  get contentBlock () {
    return this.rootEl.$('div[class^="Cart__CartContent-"]')
  }

  get productRows () {
    return this.rootEl.$$('[class^="CartProduct__Container"]')
  }

  get counter () {
    return this.rootEl.$('div[class^="Cart__CartQuantity"]')
  }
}

export default Cart