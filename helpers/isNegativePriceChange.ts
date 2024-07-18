const isNegativePriceChange = (priceChange: number) => {
  return priceChange < 0 ? true : false;
};

export default isNegativePriceChange;
