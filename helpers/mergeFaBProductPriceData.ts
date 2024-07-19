// utils/mergeData.js
import { FlattenedProduct } from "./flattenProductData";

export interface PricingData {
  productId: number;
  lowPrice: number;
  midPrice: number;
  highPrice: number;
  marketPrice: number;
  directLowPrice: number | null;
  subTypeName: string;
}

export const mergeData = (
  productData: FlattenedProduct[],
  pricingData: PricingData[]
): (FlattenedProduct & PricingData)[] => {
  const pricingMap = new Map<number, PricingData>();

  pricingData.forEach((price) => {
    pricingMap.set(price.productId, price);
  });
  return productData.map((product) => {
    const pricing = pricingMap.get(parseInt(product.tcgplayer_product_id, 10));
    return { ...product, ...pricing };
  });
};
