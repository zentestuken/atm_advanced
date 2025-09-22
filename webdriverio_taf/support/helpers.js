import allureReporter from '@wdio/allure-reporter'

export function step(description, actionFn) {
  return actionFn().then(result => {
    allureReporter.addStep(`${description} - PASSED`)
    return result
  }).catch(error => {
    allureReporter.addStep(`${description} - FAILED`, undefined, 'failed')
    throw error
  })
}

export function assert(description, assertionFn) {
  return assertionFn().then(result => {
    allureReporter.addStep(`Assert ${description} - PASSED`)
    return result
  }).catch(error => {
    allureReporter.addStep(`Assert ${description} - FAILED`, undefined, 'failed')
    throw error
  })
}

export const getPriceText = (prices, { checkoutAlert = false } = {}) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices]
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2)
  if (checkoutAlert) return new RegExp(`^Checkout - Subtotal: \\$\\s*${sum}`)
  else return new RegExp(`^\\$\\s*${sum}`)
}

export const setupAlertCapture = (browser) => {
  return browser.execute(() => {
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

const getLastAlert = (browser) => {
  return browser.execute(() => {
    const alerts = window.testAlerts || []
    return alerts.length > 0 ? alerts[alerts.length - 1] : null
  })
}

export const waitForAlert = (browser, expectedText, timeout = 5000) => {
  return (async () => {
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
    throw new Error(
      `Expected alert ${expectedType} "${expectedText}" not found within ${timeout} ms`
    )
  })()
}

// Normalize color to rgba format for consistent comparison
// Because different browsers may return rgb or rgba
export const getRgbaColorValue = (color) => {
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', ',1)')
  }
  return color
}