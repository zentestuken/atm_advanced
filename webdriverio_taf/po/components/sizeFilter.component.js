import { within } from '@testing-library/webdriverio'

export default class SizeFilter {
  constructor(browser, size) {
    this.browser = browser
    this.size = size
    this.rootEl = () => {
      const filters = this.browser.$$('[class^="Filter__Checkbox"]')
      return filters.find(async (filter) => {
        try {
          const text = await filter.$('span').getText()
          return text.includes(this.size)
        } catch {
          return false
        }
      })
    }
  }

  async getCheckbox() {
    return within(await this.rootEl()).getByRole('checkbox')
  }

  async click() {
    return (await this.rootEl()).$('span').click()
  }
}
