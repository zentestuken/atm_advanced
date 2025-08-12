export const getPriceLabelForPrices = (prices) => {
  let priceLabels = Array.isArray(prices) ? prices : [prices];
  const sum = priceLabels
    .reduce((acc, priceLabel) => acc + parseFloat(priceLabel), 0)
    .toFixed(2);
  return new RegExp(`^\\$\\s*${sum}`);
}
