import ShopPage from '../po/pages/shop.page.js'
import { getPriceLabelForPrices } from '../utils/helpers.js'
import testData from './testData'

let shopPage

describe('Shopping cart tests', () => {
  beforeEach(async () => {
    shopPage = new ShopPage(browser)
    await shopPage.open()
    expect((await shopPage.productCards).length).toBeGreaterThanOrEqual(1)
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
})
