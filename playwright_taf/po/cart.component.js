import { expect } from '@playwright/test'

class Cart {
  constructor (page) {
    this.rootEl = () => page.locator('[class^="Cart__Container"]');
  }

  closeButton () { return this.rootEl().locator('button[class^="Cart__CartButton"]').filter({ hasText: 'X' }).first(); }
  emptyMessageBlock () { return this.rootEl().locator('div[class^="CartProducts__CartProductsEmpty"]'); }
  checkoutButton () { return this.rootEl().locator('button[class^="Cart__CheckoutButton"]'); }
  subTotalLabel () { return this.rootEl().locator('div[class^="Cart__SubPriceValue"]'); }

  checkLoaded () {
    return expect(this.rootEl().locator('div[class^="Cart__CartContentHeader"]')).toBeVisible();
  }
  checkClosed () {
    return expect(this.rootEl().locator('div[class^="Cart__CartContentHeader"]')).toBeHidden();
  }
  getProductRowsCount () {
    const rows = this.rootEl().locator('[class^="CartProduct__Container"]');
    return rows.count();
  }
  getCounterText () {
    const locator = this.rootEl().locator('div[class^="Cart__CartQuantity"]');
    return locator.textContent();
  }
}

export default Cart;