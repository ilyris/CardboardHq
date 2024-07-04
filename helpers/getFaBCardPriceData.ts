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

// fetch set data, then store it in a db table?

const getGroupDataBySet = async (setId: string) => {
  // need to map [setSlug] to set_id
  const FaBSetGroupData = await axios.get("https://tcgcsv.com/62/groups");
  const groupId = FaBSetGroupData.data.results.find(
    (group: TCGCSVGroup) => group.abbreviation === setId
  ).groupId;
  return groupId;
};

const fetchCardPriceData = async (groupId: number) => {
  // fetches ALL prices & products for groupId
  const FabCardPriceResults = await axios.get(
    `https://tcgcsv.com/62/${groupId}/prices`
  );
  return FabCardPriceResults.data.results;
};

const loadCardPriceData = (
  card: Printing,
  cardsPriceData: ProductPriceData[]
) => {
  const foilingType = convertFoilingLabel(card.foiling as "S" | "R" | "C");

  const FabPriceData = cardsPriceData.find(
    (product: ProductPriceData) =>
      String(product.productId) === card?.tcgplayer_product_id &&
      foilingType === product.subTypeName
  );
  return FabPriceData;
};
export { loadCardPriceData, fetchCardPriceData, getGroupDataBySet };
