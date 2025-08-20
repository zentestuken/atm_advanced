class SizeFilter {
  constructor(page, size) {
    this.rootEl = page.locator('[class^="Filter__Checkbox"]').filter({
      has: page.locator(`span:has-text("${size}")`)
    }).first();
  }

  get checkbox() {
    return this.rootEl.getByRole('checkbox');
  }

  click() {
    return this.rootEl.locator('span').click();
  }
}

module.exports = SizeFilter;
