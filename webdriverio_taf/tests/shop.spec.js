import ShopPage from '../po/pages/shop.page.js'
import {
  getPriceLabelForPrices,
  getExpectedAlertText,
  setupAlertCapture,
  waitForAlert,
} from '../support/helpers.js'
import testData from './testData'

let shopPage

describe('Shopping cart tests', () => {
  beforeEach(async () => {
    shopPage = new ShopPage(browser)
    await shopPage.open()
    await setupAlertCapture(browser)
    await expect((await shopPage.productCards).length).toBeGreaterThanOrEqual(1)
  })

  it('Verify default product cards count', async () => {
    expect(browser).toHaveTitle(testData.shopPageTitle)
    expect((await shopPage.productCards).length).toBe(testData.defaultProductsCount)
  })

  it('Product can be added to cart', async () => {
    await shopPage.addProductToCart(testData.products[0].name)
    await expect(await shopPage.cart.contentBlock).toBeDisplayed()

    const productRow = shopPage.getProductRowInCart(testData.products[0].name)
    expect(await productRow.rootEl).toBeDisplayed()
    expect(await shopPage.cart.counter).toHaveText('1')

    await (await shopPage.cart.getCloseButton()).click()
    expect(await shopPage.cart.contentBlock).not.toBeDisplayed()
    expect(await shopPage.cart.counter).toHaveText('1')
  })

  it('Subtotal calculated correctly when products added to cart', async () => {
    const firstProductRow = shopPage.getProductRowInCart(testData.products[0].name)
    const secondProductRow = shopPage.getProductRowInCart(testData.products[1].name)

    await shopPage.addProductToCart(testData.products[0].name)
    expect(await shopPage.cart.contentBlock).toBeDisplayed()

    await shopPage.addProductToCart(testData.products[1].name)

    expect(await firstProductRow.rootEl).toBeDisplayed()
    expect(await secondProductRow.rootEl).toBeDisplayed()

    expect(await firstProductRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[0].price))
    expect(await secondProductRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    expect((await shopPage.cart.productRows).length).toBe(2)

    expect(shopPage.cart.counter).toHaveText('2')
    expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices([testData.products[0].price, testData.products[1].price]))
  })

  it('A product can be removed from the cart', async () => {
    await shopPage.addProductToCart(testData.products[0].name)
    await shopPage.addProductToCart(testData.products[1].name)
    expect(await shopPage.cart.contentBlock).toBeDisplayed()

    const productRow1 = shopPage.getProductRowInCart(testData.products[0].name)
    expect(await productRow1.rootEl).toBeDisplayed()
    const productRow2 = shopPage.getProductRowInCart(testData.products[1].name)
    expect(await productRow2.rootEl).toBeDisplayed()

    expect((await shopPage.cart.productRows).length).toBe(2)

    await (await productRow1.removeButton).click()
    expect(await productRow1.rootEl).not.toBeDisplayed()
    expect(await productRow2.rootEl).toBeDisplayed()
    expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
  })

  it('Products can be filtered by size with one filter applied', async () => {
    const sizeFilterML = shopPage.getSizeFilter('ML')
    await sizeFilterML.click()
    expect(await sizeFilterML.getCheckbox()).toBeChecked()
    expect((await shopPage.productCards).length).toBe(2)

    await sizeFilterML.click()
    expect(await sizeFilterML.getCheckbox()).not.toBeChecked()

    const sizeFilterXS = shopPage.getSizeFilter('XS')
    await sizeFilterXS.click()
    expect(await sizeFilterXS.getCheckbox()).toBeChecked()
    expect((await shopPage.productCards).length).toBe(1)
  })

  it('Product amount in cart can be updated', async () => {
    const productRow = shopPage.getProductRowInCart(testData.products[1].name)

    await shopPage.addProductToCart(testData.products[1].name)
    expect(await shopPage.cart.contentBlock).toBeDisplayed()
    expect(await productRow.rootEl).toBeDisplayed()
    expect(await productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 1$'))
    expect(await productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))

    await productRow.increaseQuantity()
    expect(await productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 2$'))
    expect(await productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(new Array(2).fill(testData.products[1].price)))

    await productRow.increaseQuantity()
    expect(await productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 3$'))
    expect(await productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(new Array(3).fill(testData.products[1].price)))

    await productRow.increaseQuantity()
    expect(await productRow.descriptionBlock).toHaveText(new RegExp('Quantity: 2$'))
    expect(await productRow.priceLabel)
      .toHaveText(getPriceLabelForPrices(testData.products[1].price))
    expect(shopPage.cart.subTotalLabel)
      .toHaveText(getPriceLabelForPrices(new Array(2).fill(testData.products[1].price)))
  })

  it('Correct checkout alert shown with one product', async () => {
    const productRow = shopPage.getProductRowInCart(testData.products[2].name)

    await shopPage.addProductToCart(testData.products[2].name)
    await expect(await shopPage.cart.contentBlock).toBeDisplayed()
    expect(await productRow.rootEl).toBeDisplayed()

    await (await shopPage.cart.getCheckoutButton()).click()
    await waitForAlert(browser, getExpectedAlertText(testData.products[2].price))
  })

  it('Correct checkout alert shown with multiple products', async () => {
    const productRow1 = shopPage.getProductRowInCart(testData.products[1].name)
    const productRow2 = shopPage.getProductRowInCart(testData.products[3].name)
    const productRow3 = shopPage.getProductRowInCart(testData.products[4].name)

    await shopPage.addProductToCart(testData.products[1].name)
    await (await shopPage.cart.getCloseButton()).click()
    await shopPage.addProductToCart(testData.products[3].name)
    await (await shopPage.cart.getCloseButton()).click()
    await shopPage.addProductToCart(testData.products[4].name)
    await expect(await shopPage.cart.contentBlock).toBeDisplayed()
    expect(await productRow1.rootEl).toBeDisplayed()
    expect(await productRow2.rootEl).toBeDisplayed()
    expect(await productRow3.rootEl).toBeDisplayed()

    await (await shopPage.cart.getCheckoutButton()).click()
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
    expect(await shopPage.cart.counter).toHaveText('0')

    await (await shopPage.cart.getCheckoutButton()).highlightAndClick()
    await waitForAlert(browser, noProductsCheckoutText)
  })

  it('Scroll product card into view', async () => {
    const productCard = shopPage.getProductCard(testData.products[3].name)
    expect(await productCard.rootEl()).toBeDisplayed()
    expect(await browser.checkElementInViewport(await productCard.rootEl())).toBe(false)

    await browser.scrollToElement(await productCard.rootEl())
    expect(await browser.checkElementInViewport(await productCard.rootEl())).toBe(true)
  })

  it('"Add to cart" button changes color when hovering over product cart (with custom hover)', async () => {
    const productCard = shopPage.getProductCard(testData.products[0].name)
    expect(await productCard.rootEl()).toBeDisplayed()
    expect(await (await productCard.getAddToCartButton()).getCSSProperty('background-color'))
      .toHaveProperty('value', testData.addToCartButton.colorDefault)

    await (await productCard.rootEl()).highlightAndHover()
    expect(await (await productCard.getAddToCartButton()).getCSSProperty('background-color'))
      .toHaveProperty('value', testData.addToCartButton.colorHover)
  })
})
