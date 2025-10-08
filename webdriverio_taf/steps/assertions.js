import { assert } from '../support/helpers'

export function checkProductCardsCountGreaterThanOrEqual(shopPage, expected) {
  return assert('product cards count', async () => {
    await expect(await shopPage.productCards.length).toBeGreaterThanOrEqual(expected)
  })
}

export function checkProductCardsCount(shopPage, expected) {
  return assert('product cards count', async () => {
    await expect(await shopPage.productCards.length).toBe(expected)
  })
}

export function checkCartCounter(shopPage, expected) {
  return assert('cart counter', async () => {
    await expect(shopPage.cart.counter).toHaveText(`${expected}`)
  })
}
