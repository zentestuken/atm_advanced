const { Before, After, Status } = require('@cucumber/cucumber');
const ShopPage = require('../../po/pages/shop.page.js');
const path = require('path');
const { ContentType } = require("allure-js-commons");
const allure = require("allure-js-commons");

Before(async function () {
  await this.openBrowser();
  this.shopPage = new ShopPage(this.page, this.baseUrl);
});

After(async function (testCase) {
  try {
    if (testCase.result.status === Status.FAILED) {
      if (this.page) {
        const screenshotPath = path.resolve(
          `./artifacts/screenshots/${testCase.pickle.name.replace(/ /g, '_')}.png`
        );
        await this.page.screenshot({ path: screenshotPath });

        if (allure) {
          allure.attachmentPath(
            'Screenshot',
            screenshotPath,
            {
              contentType: ContentType.PNG,
              fileExtension: "png",
            }
          );
        }
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error in After hook: ${error.message}`);
  } finally {
    if (this.browser) {
      await this.browser.close();
    }
  }
});
