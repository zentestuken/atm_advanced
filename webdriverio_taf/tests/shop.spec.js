import ShopPage from '../po/pages/shop.page.js';
import { getPriceLabelForPrices } from '../utils/helpers.js';
import testData from './testData';

let shopPage;

describe('Shopping cart tests', () => {
  beforeEach(async () => {
    shopPage = new ShopPage(browser);
    await shopPage.open();
    expect((await shopPage.productCards).length).toBeGreaterThanOrEqual(1);
  });

  it('Verify default product cards count', async () => {
    await expect(browser).toHaveTitle(testData.shopPageTitle);
    expect((await shopPage.productCards).length).toBe(testData.defaultProductsCount);
  });

  it('Product can be added to cart', async () => {
    await shopPage.addProductToCart(testData.products[0].name);
    expect(await shopPage.cart.contentBlock).toBeDisplayed();

    const productRow = shopPage.getProductRowInCart(testData.products[0].name);
    expect(await productRow.rootEl).toBeDisplayed();
    expect(await shopPage.cart.counter).toHaveText('1');

    await (await shopPage.cart.getCloseButton()).click();
    expect(await shopPage.cart.contentBlock).not.toBeDisplayed();
    expect(await shopPage.cart.counter).toHaveText('1');
  });

  it('Subtotal calculated correctly when products added to cart', async () => {
    let firstProductRow, secondProductRow;

    await shopPage.addProductToCart(testData.products[0].name);
    expect(await shopPage.cart.contentBlock).toBeDisplayed();

    await shopPage.addProductToCart(testData.products[1].name);
    firstProductRow = shopPage.getProductRowInCart(testData.products[0].name);
    secondProductRow = shopPage.getProductRowInCart(testData.products[1].name);

    expect(await firstProductRow.rootEl).toBeDisplayed();
    expect(await secondProductRow.rootEl).toBeDisplayed();

    expect(await firstProductRow.priceLabel).toHaveText(getPriceLabelForPrices(testData.products[0].price));
    expect(await secondProductRow.priceLabel).toHaveText(getPriceLabelForPrices(testData.products[1].price));
    expect((await shopPage.cart.productRows).length).toBe(2);

    expect(shopPage.cart.counter).toHaveText('2');
    expect(shopPage.cart.subTotalLabel).toHaveText(getPriceLabelForPrices([testData.products[0].price, testData.products[1].price]));
  });
});
