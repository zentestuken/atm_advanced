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
}
