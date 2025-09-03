// Original Playwright code for reference:
// class Cart {
//   constructor (page) {
//     this.rootEl = page.locator('[class^="Cart__Container"]');
//   }
//
//   get closeButton () { return this.rootEl.getByRole('button', { name: 'X' }); }
//   get emptyMessageBlock () { 
//     return this.rootEl.locator('div[class^="CartProducts__CartProductsEmpty"]'); 
//   }
//   get checkoutButton () { return this.rootEl.getByRole('button', { name: 'Checkout' }); }
//   get subTotalLabel () { return this.rootEl.locator('[class^="Cart__SubPriceValue"]'); }
//
//   get contentBlock () {
//     return this.rootEl.locator('div[class^="Cart__CartContent-"]');
//   }
//   get productRows () {
//     return this.rootEl.locator('[class^="CartProduct__Container"]');
//   }
//   get counter () {
//     return this.rootEl.locator('div[class^="Cart__CartQuantity"]');
//   }
// }

// WebdriverIO version:
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
  
  get checkoutButton () { 
    return within(this.rootEl()).getByRole('button', { name: 'Checkout' })
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