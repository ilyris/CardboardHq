import axios from "axios";

interface TCGCSVGroup {
  groupId: number;
  name: string;
  abbreviation: string;
  isSupplemental: false;
  publishedOn: Date;
  modifiedOn: Date;
  categoryId: number;
}

interface ProductPriceData {
  productId: string;
  lowPrice: number;
  midPrice: number;
  highPrice: number;
  marketPrice: number;
  directLowPrice: number | null;
  subTypeName: string;
}

const convertFoilingLabel = (foiling: "S" | "C" | "R") => {
  if (foiling === "S") return "Normal";
  if (foiling === "R") return "Rainbow Foil";
  if (foiling === "C") return "Cold Foil";
};

const loadCardPriceData = async (card: any) => {
  const FaBSetGroupData = await axios.get("https://tcgcsv.com/62/groups");
  const specificGroupId = FaBSetGroupData.data.results.find(
    (group: TCGCSVGroup) => group.abbreviation === card?.set_id
  );
  const FabCardPriceResults = await axios.get(
    `https://tcgcsv.com/62/${specificGroupId.groupId}/prices`
  );
  const foilingType = convertFoilingLabel(card.foiling);
  console.log({ foilingType });

  const FabCardPriceData: ProductPriceData[] = FabCardPriceResults.data.results;
  const FabPriceData = FabCardPriceData.find(
    (product: ProductPriceData) =>
      String(product.productId) === card?.tcgplayer_product_id &&
      foilingType === product.subTypeName
  );
  return FabPriceData;
};
export default loadCardPriceData;
