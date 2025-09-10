export async function setupAlertCapture(browser) {
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

async function getLastAlert(browser) {
  return await browser.execute(() => {
    const alerts = window.testAlerts || []
    return alerts.length > 0 ? alerts[alerts.length - 1] : null
  })
}

export async function waitForAlert(browser, expectedText, timeout = 5000) {
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
