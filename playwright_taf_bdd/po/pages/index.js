const ShopPage = require('./shop.page');

class PageManager {
  constructor(page) {
    this.page = page;
  }

  get(pageName) {
    switch (pageName.toLowerCase()) {
      case 'shop':
        return new ShopPage(this.page);
    default:
        throw new Error(`Page "${pageName}" is not defined`);
    }
  }
}

module.exports = PageManager;