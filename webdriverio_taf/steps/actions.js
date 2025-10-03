import Cart from '../po/components/cart.component'
import ProductRowInCart from '../po/components/productRowInCart.component'
import SizeFilter from '../po/components/sizeFilter.component'
import ProductCard from '../po/components/productCard.component'
import { step } from '../support/helpers'

const PAGE_PRODUCT_COUNTER_POSTFIX = 'Product(s) found'

export function clickCheckout (browser) {
  const cart = new Cart(browser)
  return step('Click on "Checkout" button', async () => {
    return cart.checkoutButton.click()
  })
}

export function increaseQuantity (browser, productName) {
  const productRow = new ProductRowInCart(browser, productName)
  return step(`Increase quantity for "${productName}"`, async () => {
    return productRow.plusButton.click()
  })
}

export function decreaseQuantity (browser, productName) {
  const productRow = new ProductRowInCart(browser, productName)
  return step(`Decrease quantity for "${productName}"`, async () => {
    return productRow.minusButton.click()
  })
}

export function removeFromCart (browser, productName) {
  const productRow = new ProductRowInCart(browser, productName)
  return step(`Remove "${productName}" from cart`, async () => {
    return productRow.removeButton.click()
  })
}

export function getPageProductCounterText (browser) {
  return step('Get product counter text', async () => {
    const locator = browser.$(`//p[contains(., '${PAGE_PRODUCT_COUNTER_POSTFIX}')]`)
    const textContent = await locator.getText()
    const match = textContent.match(/\d+/)
    const number = match ? parseInt(match[0], 10) : ''
    return number
  })
}

export function addProductToCart (browser, productName) {
  const productCard = new ProductCard(browser, productName)
  return step(`Add product to cart "${productName}"`, async () => {
    return (await productCard.addToCartButton).click()
  })
}

export function hoverOverProductCard (browser, productName) {
  const productCard = new ProductCard(browser, productName)
  return step(`Hover over product card "${productName}"`, async () => {
    return (await productCard.rootEl).moveTo()
  })
}

export function clickOnSizeFilter (browser, size) {
  const sizeFilter = new SizeFilter(browser, size)
  return step(`Select size filter "${size}"`, async () => {
    return sizeFilter.rootEl.$('span').click()
  })
}

export function toggleCart (shopPage, { highlight = false } = {}) {
  return step(`Toggle cart${highlight ? '(with highlighting)' : ''}`, async () => {
    if (highlight) return shopPage.toggleCartButton.highlightAndClick()
    return shopPage.toggleCartButton.click()
  })
}
