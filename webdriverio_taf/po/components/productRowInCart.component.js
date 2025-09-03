// Original Playwright code for reference:
// export default class ProductRowInCart {
//   constructor (page, productName) {
//     this.rootEl = page.locator('[class^="CartProduct__Container"]').filter({ hasText: productName }).first();
//   }
//
//   get plusButton () { return this.rootEl.getByRole('button', { name: '+' }); }
//   get minusButton () { return this.rootEl.getByRole('button', { name: '-' }); }
//   get priceLabel () { return this.rootEl.locator('div[class^="CartProduct__Price"] p'); }
//
//   increaseQuantity () {
//     return this.plusButton().click();
//   }
//
//   decreaseQuantity () {
//     return this.minusButton().click();
//   }
// }

// WebdriverIO version:
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

  async increaseQuantity () {
    return (await this.getPlusButton()).click()
  }

  async decreaseQuantity () {
    return (await this.getMinusButton()).click()
  }
}
