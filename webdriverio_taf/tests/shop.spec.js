import ShopPage from '../po/pages/shop.page.js'
import {
  getPriceLabelForPrices,
  getExpectedAlertText,
  setupAlertCapture,
  waitForAlert,
  getRgbaColorValue,
} from '../support/helpers.js'
import testData from './testData'

let shopPage

describe('Shopping cart tests', () => {
  beforeEach(async () => {
    shopPage = new ShopPage(browser)
    await shopPage.open()
    await setupAlertCapture(browser)
    await expect(await shopPage.productCards.length).toBeGreaterThanOrEqual(1)
  })

  it('Verify default product cards count', async () => {
    await expect(browser).toHaveTitle(testData.shopPageTitle)
    await expect(await shopPage.productCards.length).toBe(testData.defaultProductsCount)
  })

  it('Product can be added to cart', async () => {
    await shopPage.addProductToCart(testData.products[0].name)
    await expect(shopPage.cart.contentBlock).toBeDisplayed()

    const productRow = shopPage.getProductRowInCart(testData.products[0].name)
    await expect(productRow.rootEl).toBeDisplayed()
    await expect(shopPage.cart.counter).toHaveText('1')

    await shopPage.toggleCart()
    await expect(shopPage.cart.contentBlock).not.toBeDisplayed()
    await expect(shopPage.cart.counter).toHaveText('1')
  })

  it('Subtotal calculated correctly when products added to cart', async () => {
    const firstProductRow = shopPage.getProductRowInCart(testData.products[0].name)
    const secondProductRow = shopPage.getProductRowInCart(testData.products[1].name)

    await shopPage.addProductToCart(testData.products[0].name)
    await expect(shopPage.cart.contentBlock).toBeDisplayed()

    await shopPage.addProductToCart(testData.products[1].name)

    await expect(firstProductRow.rootEl).toBeDisplayed()
    await expect(secondProductRow.rootEl).toBeDisplayed()

    await expect(firstProductRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[0].price))
    await expect(secondProductRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    await expect(await shopPage.cart.productRows.length).toBe(2)

    await expect(shopPage.cart.counter).toHaveText('2')
    await expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices([testData.products[0].price, testData.products[1].price]))
  })

  it('A product can be removed from the cart', async () => {
    await shopPage.addProductToCart(testData.products[0].name)
    await shopPage.addProductToCart(testData.products[1].name)
    await expect(shopPage.cart.contentBlock).toBeDisplayed()

    const productRow1 = shopPage.getProductRowInCart(testData.products[0].name)
    await expect(productRow1.rootEl).toBeDisplayed()
    const productRow2 = shopPage.getProductRowInCart(testData.products[1].name)
    await expect(productRow2.rootEl).toBeDisplayed()

    await expect(await shopPage.cart.productRows.length).toBe(2)

    await productRow1.removeButton.click()
    await expect(productRow1.rootEl).not.toBeDisplayed()
    await expect(productRow2.rootEl).toBeDisplayed()
    await expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
  })

  it('Products can be filtered by size with one filter applied', async () => {
    const sizeFilterML = shopPage.getSizeFilter('ML')
    await sizeFilterML.click()
    await expect(sizeFilterML.checkbox).toBeChecked()
    await expect(await shopPage.productCards.length).toBe(2)

    await sizeFilterML.click()
    await expect(sizeFilterML.checkbox).not.toBeChecked()

    const sizeFilterXS = shopPage.getSizeFilter('XS')
    await sizeFilterXS.click()
    await expect(sizeFilterXS.checkbox).toBeChecked()
    await expect(await shopPage.productCards.length).toBe(1)
  })

  it('Product amount in cart can be updated', async () => {
    const productRow = shopPage.getProductRowInCart(testData.products[1].name)

    await shopPage.addProductToCart(testData.products[1].name)
    await expect(shopPage.cart.contentBlock).toBeDisplayed()
    await expect(productRow.rootEl).toBeDisplayed()
    await expect(productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 1$'))
    await expect(productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))

    await productRow.increaseQuantity()
    await expect(productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 2$'))
    await expect(productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    await expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(new Array(2).fill(testData.products[1].price)))

    await productRow.increaseQuantity()
    await expect(productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 3$'))
    await expect(productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    await expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(new Array(3).fill(testData.products[1].price)))

    await productRow.decreaseQuantity()
    await expect(productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 2$'))
    await expect(productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    await expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(new Array(2).fill(testData.products[1].price)))
  })

  it('Correct checkout alert shown with one product', async () => {
    const productRow = shopPage.getProductRowInCart(testData.products[2].name)

    await shopPage.addProductToCart(testData.products[2].name)
    await expect(shopPage.cart.contentBlock).toBeDisplayed()
    await expect(productRow.rootEl).toBeDisplayed()

    await shopPage.cart.checkoutButton.click()
    await waitForAlert(browser, getExpectedAlertText(testData.products[2].price))
  })

  it('Correct checkout alert shown with multiple products', async () => {
    const productRow1 = shopPage.getProductRowInCart(testData.products[1].name)
    const productRow2 = shopPage.getProductRowInCart(testData.products[3].name)
    const productRow3 = shopPage.getProductRowInCart(testData.products[4].name)

    await shopPage.addProductToCart(testData.products[1].name)
    await expect(productRow1.rootEl).toBeDisplayed()
    await shopPage.toggleCart()
    await shopPage.addProductToCart(testData.products[3].name)
    await expect(productRow2.rootEl).toBeDisplayed()
    await shopPage.toggleCart()
    await shopPage.addProductToCart(testData.products[4].name)
    await expect(shopPage.cart.contentBlock).toBeDisplayed()
    await expect(productRow3.rootEl).toBeDisplayed()

    await shopPage.cart.checkoutButton.click()
    await waitForAlert(browser, getExpectedAlertText([
      testData.products[1].price,
      testData.products[3].price,
      testData.products[4].price
    ]))
  })

  it('Correct checkout alert shown with no products (with custom click)', async () => {
    const noProductsCheckoutText = 'Add some product in the cart!'

    await shopPage.toggleCart({ highlight: true })
    await expect(await shopPage.cart.contentBlock).toBeDisplayed()
    await expect(shopPage.cart.counter).toHaveText('0')

    await shopPage.cart.checkoutButton.highlightAndClick()
    await waitForAlert(browser, noProductsCheckoutText)
  })

  it('Scroll product card into view', async () => {
    const productCard = shopPage.getProductCard(testData.products[3].name)
    await expect(productCard.rootEl).toBeDisplayed()
    await expect(await browser.checkElementInViewport(productCard.rootEl)).toBe(false)

    await browser.scrollToElement(productCard.rootEl)
    await expect(await browser.checkElementInViewport(productCard.rootEl)).toBe(true)
  })

  it('"Add to cart" button changes color when hovering over product cart (with custom hover)', async () => {
    const productCard = shopPage.getProductCard(testData.products[0].name)

    await browser.resetCursor()
    await expect(productCard.rootEl).toBeDisplayed()
    const defaultColor = (await productCard.addToCartButton.getCSSProperty('background-color')).value
    await expect(getRgbaColorValue(defaultColor))
      .toEqual(testData.addToCartButton.colorDefault)

    await (productCard.rootEl).highlightAndHover()
    const newColor = (await productCard.addToCartButton.getCSSProperty('background-color')).value
    await expect(getRgbaColorValue(newColor))
      .toEqual(testData.addToCartButton.colorHover)
  })

  it('Product image changes when hovering over product cart', async () => {
    const productCard = shopPage.getProductCard(testData.products[0].name)

    await browser.resetCursor()
    await expect(productCard.rootEl).toBeDisplayed()
    const defaultImageUrl = (await productCard.image.getCSSProperty('background-image')).value

    await shopPage.hoverOverProductCard(testData.products[0].name)
    const newImageUrl = (await productCard.image.getCSSProperty('background-image')).value
    await expect(newImageUrl).not.toEqual(defaultImageUrl)
  })
})
