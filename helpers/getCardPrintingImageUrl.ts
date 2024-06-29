import { Card } from "@/typings/FaBCard";
import { CardSet } from "@/typings/FaBSet";

const getPrintingImageUrl = (
  card: Card | null,
  fabSetData: CardSet
): string | undefined => {
  const setId = fabSetData.id;

  if (!card) return;
  const printing = card.printings.find((printing) => printing.set_id === setId);
  return printing ? printing.image_url : undefined;
};

export default getPrintingImageUrl;
