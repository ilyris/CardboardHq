import axios from "axios";

export interface ProductPriceData {
  productId: string;
  lowPrice: number;
  midPrice: number;
  highPrice: number;
  marketPrice: number;
  directLowPrice: number | null;
  subTypeName: string;
}

const fetchCardPriceData = async (
  productId: string,
  foiling: string,
  edition: string
) => {
  const FabCardPriceResults = await axios.get("/api/cardPriceData/get", {
    params: {
      productId: productId || "",
      foiling,
      edition,
    },
  });
  return FabCardPriceResults.data.results;
};

export { fetchCardPriceData };
