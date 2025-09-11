export default () => {
  browser.addCommand('scrollToElement', async function (targetElement) {
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
  })

  browser.addCommand('checkElementInViewport', async function (targetElement) {
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
  })

  browser.addCommand('highlight', async function ({ color = 'red', highlightTime = 1000 } = {}) {
    await browser.execute((el, highlightColor) => {
      el.style.border = `3px solid ${highlightColor}`
    }, this, color)
    await browser.pause(highlightTime)
    await browser.execute((el) => {
      el.style.border = ''
    }, this)
  }, true)

  browser.addCommand('highlightAndClick', async function ({ highlightTime = 1000 } = {}) {
    await this.waitForClickable()
    await this.highlight({ color: 'red', highlightTime })
    await this.click()
  }, true)

  browser.addCommand('highlightAndHover', async function ({ xOffset = 10, yOffset = 10, highlightTime = 1000 } = {}) {
    await this.waitForDisplayed()
    await this.moveTo(xOffset, yOffset)
    await this.highlight({ color: 'yellow', highlightTime })
  }, true)

  browser.addCommand('resetCursor', async function () {
    await browser.performActions([
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [{ type: 'pointerMove', x: 0, y: 0 }],
      },
    ])
    await browser.pause(500)
  })
}
