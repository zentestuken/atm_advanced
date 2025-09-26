import ShopPage from '../po/pages/shop.page'
import {
  getPriceText,
  setupAlertCapture,
  waitForAlert,
  getRgbaColorValue,
  assert,
} from '../support/helpers'
import {
  clickCheckout,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clickOnSizeFilter,
  getPageProductCounterText,
  addProductToCart,
  hoverOverProductCard,
  toggleCart,
} from '../steps/actions'
import {
  checkProductCardsCountGreaterThanOrEqual,
  checkProductCardsCount,
  checkCartCounter,
} from '../steps/assertions'
import testData from './testData'

let shopPage

describe('Shopping cart tests', () => {
  beforeEach(async () => {
    shopPage = new ShopPage(browser)
    await shopPage.open()
    await setupAlertCapture(browser)
    await checkProductCardsCountGreaterThanOrEqual(shopPage, 1)
  })

  it('Verify default product cards count', async () => {
    await assert('page title', async () => {
      await expect(browser).toHaveTitle(testData.shopPageTitle)
    })
    await checkProductCardsCount(shopPage, testData.defaultProductsCount)
    await assert('product counter text', async () => {
      await expect(await getPageProductCounterText(browser)).toBe(testData.defaultProductsCount)
    })
  })

  it('Product can be added to cart', async () => {
    await addProductToCart(browser, testData.products[0].name)
    await assert('cart opened', async () => {
      await expect(shopPage.cart.contentBlock).toBeDisplayed()
    })
    const productRow = shopPage.getProductRowInCart(testData.products[0].name)
    await assert('product row shown in cart', async () => {
      await expect(productRow.rootEl).toBeDisplayed()
    })
    await checkCartCounter(shopPage, 1)
    await toggleCart(shopPage)
    await assert('cart opened', async () => {
      await expect(shopPage.cart.contentBlock).not.toBeDisplayed()
    })
    await checkCartCounter(shopPage, 1)
  })

  it('Subtotal calculated correctly when products added to cart', async () => {
    const firstProductRow = shopPage.getProductRowInCart(testData.products[0].name)
    const secondProductRow = shopPage.getProductRowInCart(testData.products[1].name)

    await addProductToCart(browser, testData.products[0].name)
    await assert('cart opened', async () => {
      await expect(shopPage.cart.contentBlock).toBeDisplayed()
    })

    await addProductToCart(browser, testData.products[1].name)
    await assert('product 1 in cart', async () => {
      await expect(firstProductRow.rootEl).toBeDisplayed()
    })
    await assert('product 2 in cart', async () => {
      await expect(secondProductRow.rootEl).toBeDisplayed()
    })
    await assert('product 1 price label', async () => {
      await expect(firstProductRow.priceLabel)
        .toHaveText(getPriceText(testData.products[0].price))
    })
    await assert('product 2 price label', async () => {
      await expect(secondProductRow.priceLabel)
        .toHaveText(getPriceText(testData.products[1].price))
    })
    await assert('product count in cart', async () => {
      await expect(await shopPage.cart.productRows.length).toBe(2)
    })
    await checkCartCounter(shopPage, 2)
    await assert('cart subtotal', async () => {
      await expect(shopPage.cart.subTotalLabel)
        .toHaveText(getPriceText(
          [testData.products[0].price, testData.products[1].price]))
    })
  })

  it('A product can be removed from the cart', async () => {
    await addProductToCart(browser, testData.products[0].name)
    await addProductToCart(browser, testData.products[1].name)
    await assert('cart opened', async () => {
      await expect(shopPage.cart.contentBlock).toBeDisplayed()
    })

    const productRow1 = shopPage.getProductRowInCart(testData.products[0].name)
    await assert('product 1 in cart', async () => {
      await expect(productRow1.rootEl).toBeDisplayed()
    })
    const productRow2 = shopPage.getProductRowInCart(testData.products[1].name)
    await assert('product 2 in cart', async () => {
      await expect(productRow2.rootEl).toBeDisplayed()
    })

    await assert('product count in cart', async () => {
      await expect(await shopPage.cart.productRows.length).toBe(2)
    })

    await removeFromCart(browser, testData.products[0].name)
    await assert('product 1 removed', async () => {
      await expect(productRow1.rootEl).not.toBeDisplayed()
    })
    await assert('product 2 still in cart', async () => {
      await expect(productRow2.rootEl).toBeDisplayed()
    })
    await assert('cart subtotal', async () => {
      await expect(shopPage.cart.subTotalLabel)
        .toHaveText(getPriceText(testData.products[1].price))
    })
  })

  it('Products can be filtered by size with one filter applied', async () => {
    const sizeFilterML = shopPage.getSizeFilter('ML')
    await clickOnSizeFilter(browser, 'ML')
    await assert('size filter checked', async () => {
      await expect(sizeFilterML.checkbox).toBeChecked()
    })
    await checkProductCardsCount(shopPage, 2)

    await clickOnSizeFilter(browser, 'ML')
    await assert('size filter unchecked', async () => {
      await expect(sizeFilterML.checkbox).not.toBeChecked()
    })

    const sizeFilterXS = shopPage.getSizeFilter('XS')
    await clickOnSizeFilter(browser, 'XS')
    await assert('size filter checked', async () => {
      await expect(sizeFilterXS.checkbox).toBeChecked()
    })
    await checkProductCardsCount(shopPage, 1)
  })

  it('Product amount in cart can be updated', async () => {
    const productRow = shopPage.getProductRowInCart(testData.products[1].name)

    await addProductToCart(browser, testData.products[1].name)
    await assert('cart opened', async () => {
      await expect(shopPage.cart.contentBlock).toBeDisplayed()
    })
    await assert('product in cart', async () => {
      await expect(productRow.rootEl).toBeDisplayed()
    })
    await assert('product quantity', async () => {
      await expect(productRow.descriptionBlock).toHaveText(/Quantity: 1$/)
    })
    await assert('product price', async () => {
      await expect(productRow.priceLabel)
        .toHaveText(getPriceText(testData.products[1].price))
    })

    await increaseQuantity(browser, testData.products[1].name)
    await assert('product quantity', async () => {
      await expect(productRow.descriptionBlock).toHaveText(/Quantity: 2$/)
    })
    await assert('product price', async () => {
      await expect(productRow.priceLabel)
        .toHaveText(getPriceText(testData.products[1].price))
    })
    await assert('cart subtotal', async () => {
      await expect(shopPage.cart.subTotalLabel)
        .toHaveText(getPriceText(new Array(2).fill(testData.products[1].price)))
    })

    await increaseQuantity(browser, testData.products[1].name)
    await assert('product quantity', async () => {
      await expect(productRow.descriptionBlock).toHaveText(/Quantity: 3$/)
    })
    await assert('product price', async () => {
      await expect(productRow.priceLabel)
        .toHaveText(getPriceText(testData.products[1].price))
    })
    await assert('cart subtotal', async () => {
      await expect(shopPage.cart.subTotalLabel)
        .toHaveText(getPriceText(new Array(3).fill(testData.products[1].price)))
    })

    await decreaseQuantity(browser, testData.products[1].name)
    await assert('product quantity', async () => {
      await expect(productRow.descriptionBlock).toHaveText(/Quantity: 2$/)
    })
    await assert('product price', async () => {
      await expect(productRow.priceLabel)
        .toHaveText(getPriceText(testData.products[1].price))
    })
    await assert('cart subtotal', async () => {
      await expect(shopPage.cart.subTotalLabel)
        .toHaveText(getPriceText(new Array(2).fill(testData.products[1].price)))
    })
  })

  it('Correct checkout alert shown with one product', async () => {
    const productRow = shopPage.getProductRowInCart(testData.products[2].name)

    await addProductToCart(browser, testData.products[2].name)
    await assert('cart opened', async () => {
      await expect(shopPage.cart.contentBlock).toBeDisplayed()
    })
    await assert('product in cart', async () => {
      await expect(productRow.rootEl).toBeDisplayed()
    })

    await clickCheckout(browser)
    await assert('checkout alert text', async () => {
      await waitForAlert(browser, getPriceText(
        testData.products[2].price,
        { checkoutAlert: true }
      ))
    })
  })

  it('Correct checkout alert shown with multiple products', async () => {
    const productRow1 = shopPage.getProductRowInCart(testData.products[1].name)
    const productRow2 = shopPage.getProductRowInCart(testData.products[3].name)
    const productRow3 = shopPage.getProductRowInCart(testData.products[4].name)

    await addProductToCart(browser, testData.products[1].name)
    await assert('product 1 in cart', async () => {
      await expect(productRow1.rootEl).toBeDisplayed()
    })
    await toggleCart(shopPage)
    await addProductToCart(browser, testData.products[3].name)
    await assert('product 2 in cart', async () => {
      await expect(productRow2.rootEl).toBeDisplayed()
    })
    await toggleCart(shopPage)
    await addProductToCart(browser, testData.products[4].name)
    await assert('cart opened', async () => {
      await expect(shopPage.cart.contentBlock).toBeDisplayed()
    })
    await assert('product 3 in cart', async () => {
      await expect(productRow3.rootEl).toBeDisplayed()
    })

    await clickCheckout(browser)
    await assert('checkout alert text', async () => {
      await waitForAlert(browser, getPriceText(
        [
          testData.products[1].price,
          testData.products[3].price,
          testData.products[4].price
        ],
        { checkoutAlert: true }
      ))
    })
  })

  it('Correct checkout alert shown with no products (with custom click)', async () => {
    const noProductsCheckoutText = 'Add some product in the cart!'

    await toggleCart(shopPage, { highlight: true })
    await assert('cart opened', async () => {
      await expect(await shopPage.cart.contentBlock).toBeDisplayed()
    })
    await checkCartCounter(shopPage, 0)

    await shopPage.cart.checkoutButton.highlightAndClick()
    await assert('checkout alert text', async () => {
      await waitForAlert(browser, noProductsCheckoutText)
    })
  })

  it('Scroll product card into view', async () => {
    const productCard = shopPage.getProductCard(testData.products[3].name)
    await assert('product card displayed', async () => {
      await expect(productCard.rootEl).toBeDisplayed()
    })
    await assert('product card not in viewport', async () => {
      await expect(await browser.checkElementInViewport(productCard.rootEl)).toBe(false)
    })

    await browser.scrollToElement(productCard.rootEl)
    await assert('product card in viewport', async () => {
      await expect(await browser.checkElementInViewport(productCard.rootEl)).toBe(true)
    })
  })

  it('"Add to cart" button changes color when hovering over product cart (with custom hover)', async () => {
    const productCard = shopPage.getProductCard(testData.products[0].name)

    await browser.resetCursor()
    await assert('product card displayed', async () => {
      await expect(productCard.rootEl).toBeDisplayed()
    })
    const defaultColor = (await productCard.addToCartButton.getCSSProperty('background-color')).value
    await assert('button default color', async () => {
      await expect(getRgbaColorValue(defaultColor))
        .toEqual(testData.addToCartButton.colorDefault)
    })

    await (productCard.rootEl).highlightAndHover()
    const newColor = (await productCard.addToCartButton.getCSSProperty('background-color')).value
    await assert('button hover color', async () => {
      await expect(getRgbaColorValue(newColor))
        .toEqual(testData.addToCartButton.colorHover)
    })
  })

  it('Product image changes when hovering over product cart', async () => {
    const productCard = shopPage.getProductCard(testData.products[0].name)

    await browser.resetCursor()
    await assert('product card displayed', async () => {
      await expect(productCard.rootEl).toBeDisplayed()
    })
    const defaultImageUrl = (await productCard.image.getCSSProperty('background-image')).value

    await hoverOverProductCard(browser, testData.products[0].name)
    const newImageUrl = (await productCard.image.getCSSProperty('background-image')).value
    await assert('image changed', async () => {
      await expect(newImageUrl).not.toEqual(defaultImageUrl)
    })
  })
})
