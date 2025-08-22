const { expect } = require('@playwright/test');

const getPriceLabelForPrices = (prices) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices];
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2);
  return new RegExp(`^\\$\\s*${sum}`);
};

async function handleCheckoutAlert(page, subtotal) {
  return new Promise((resolve, reject) => {
    let timeoutId;
    timeoutId = setTimeout(() => {
      reject(new Error('Dialog was not triggered within the timeout period.'));
    }, 5000);
    page.once('dialog', async (dialog) => {
      clearTimeout(timeoutId);
      try {
        expect(dialog.message()).toBe(`Checkout - Subtotal: $ ${subtotal}`);
        await dialog.accept();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = {
  getPriceLabelForPrices,
  handleCheckoutAlert
};
