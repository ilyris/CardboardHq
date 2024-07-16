import { Printing } from "@/typings/FaBCard";
import invertFoiling from "./invertFoiling";

const getPrintingImageUrl = (
  image_url: string,
  cardId: string,
  foiling: string | null
): string | undefined => {
  if (!image_url || !foiling) return;
  return (
    printings.find(
      (printing) =>
        printing.id === cardId && printing.foiling === invertFoiling(foiling)
    )?.image_url || undefined
  );
};

export default getPrintingImageUrl;
