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

const getDays = (dayInterval: string) => {
  switch (dayInterval) {
    case "7d":
      return 7;
    case "1m":
      return 31;
    case "6m":
      return 31 * 6;
    default:
      return 7;
  }
};

const fetchCardPriceData = async (
  productId: string,
  foiling: string,
  edition: string,
  dayInterval = "7d"
) => {
  const days = getDays(dayInterval);
  const FabCardPriceResults = await axios.get("/api/cardPriceData/get", {
    params: {
      productId: productId || "",
      foiling,
      edition,
      dayInterval: days,
    },
  });
  return FabCardPriceResults.data.results;
};

export { fetchCardPriceData };
