import { step } from '../../support/helpers.js'

export default class SizeFilter {
  constructor(browser, size) {
    this.browser = browser
    this.size = size
  }

  get rootEl() {
    return this.browser
      .$('//div[starts-with(@class, "Filter__Checkbox") and ' +
        `.//span[text()="${this.size}"]]`)
  }

  get checkbox() {
    return this.rootEl.$('[type=checkbox]')
  }

  async click() {
    return step(`Click on size filter "${this.size}"`, async () => {
      return this.rootEl.$('span').click()
    })
  }
}
