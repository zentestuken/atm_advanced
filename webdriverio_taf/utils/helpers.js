export const getPriceLabelForPrices = (prices) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices]
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2)
  return new RegExp(`^\\$\\s*${sum}`)
}

export const waitForAlert = async (browser) => {
  await browser.waitUntil(() => browser.isAlertOpen(),
    { timeoutMsg: 'Alert not shown within timeout' }
  )
}

export const getExpectedAlertText = (prices) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices]
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2)
  return new RegExp(`^Checkout - Subtotal: \\$\\s*${sum}`)
}

export const scrollToElement = async (browser, targetElement) => {
  const element = typeof targetElement === 'function'
    ? await targetElement()
    : await targetElement
  const location = await element.getLocation()

  await browser.execute((x, y) => {
    window.scrollTo({
      left: x - window.innerWidth / 2,
      top: y - window.innerHeight / 2,
    })
  }, location.x, location.y)
}

export const checkElementInViewport = async (browser, targetElement) => {
  const element = typeof targetElement === 'function'
    ? await targetElement()
    : await targetElement
  const size = await element.getSize()
  return browser.execute((el, elSize) => {
    const rect = el.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom - elSize.height * 0.6 <= viewport.height &&
      rect.right - elSize.height * 0.6 <= viewport.width
    )
  }, element, size)
}
