import axios from "axios";
import convertFoilingLabel from "./convertFoilingLabel";
import { Printing } from "@/typings/FaBCard";

interface TCGCSVGroup {
  groupId: number;
  name: string;
  abbreviation: string;
  isSupplemental: false;
  publishedOn: Date;
  modifiedOn: Date;
  categoryId: number;
}

export interface ProductPriceData {
  productId: string;
  lowPrice: number;
  midPrice: number;
  highPrice: number;
  marketPrice: number;
  directLowPrice: number | null;
  subTypeName: string;
}

const fetchCardPriceData = async (productId: string, foiling: string) => {
  // fetches ALL prices & products for groupId
  const FabCardPriceResults = await axios.get("/api/cardPriceData/get", {
    params: {
      productId: productId || "",
      foiling,
    },
  });
  return FabCardPriceResults.data.results;
};

export { fetchCardPriceData };
