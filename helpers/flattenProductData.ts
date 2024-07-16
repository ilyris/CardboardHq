import { Card, Printing } from "@/typings/FaBCard";

export interface FlattenedProduct extends Card, Printing {
  product_unique_id: string;
}

export const flattenProductData = (
  data: Record<string, Card[]>
): FlattenedProduct[] => {
  let flattenedData: FlattenedProduct[] = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      data[key].forEach((product) => {
        product.printings.forEach((printing) => {
          flattenedData.push({
            ...product,
            ...printing,
            name: product.name,
            unique_id: printing.unique_id,
            product_unique_id: product.unique_id,
          });
        });
      });
    }
  }
  return flattenedData;
};
