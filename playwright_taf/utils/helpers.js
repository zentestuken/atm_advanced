export async function waitForElement(locator, { timeout = 10_000, isVisible = true } = {}) {
  if (isVisible) {
    await locator.waitFor({ state: 'visible', timeout });
  } else {
    await locator.waitFor({ state: 'hidden', timeout });
  }
}

export const getPriceLabelForPrices = (prices) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices];
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2);
  const space = priceLabels.length === 1 ? '  ' : ' ';
  return `$${space}${sum}`;
}
