export const getPriceLabelForPrices = (prices) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices]
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2)
  return new RegExp(`^\\$\\s*${sum}`)
}

export const getExpectedAlertText = (prices) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices]
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2)
  return new RegExp(`^Checkout - Subtotal: \\$\\s*${sum}`)
}

export const setupAlertCapture = async (browser) => {
  await browser.execute(() => {
    window.testAlerts = []
    window.originalAlert = window.alert

    window.alert = function(message) {
      window.testAlerts.push({
        message: message,
        timestamp: Date.now()
      })
      return true
    }
  })
}

const getLastAlert = async (browser) => {
  return await browser.execute(() => {
    const alerts = window.testAlerts || []
    return alerts.length > 0 ? alerts[alerts.length - 1] : null
  })
}

export const waitForAlert = async (browser, expectedText, timeout = 5000) => {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const alert = await getLastAlert(browser)
    if (alert) {
      const matches = expectedText instanceof RegExp
        ? expectedText.test(alert.message)
        : alert.message === expectedText
      if (matches) {
        return alert
      }
    }
    await browser.pause(100)
  }
  const expectedType = expectedText instanceof RegExp ? 'pattern' : 'text'
  throw new Error(`Expected alert ${expectedType} "${expectedText}" not found within ${timeout} ms`)
}

// Normalize color to rgba format for consistent comparison
// Because different browsers may return rgb or rgba
export const getRgbaColorValue = (color) => {
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', ',1)')
  }
  return color
}