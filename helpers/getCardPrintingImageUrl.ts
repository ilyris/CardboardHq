import { Printing } from "@/typings/FaBCard";
import invertFoiling from "./invertFoiling";

const getPrintingImageUrl = (
  printings: Printing[] | null,
  cardId: string,
  foiling: string | null
): string | undefined => {
  if (!printings || !foiling) return;
  return (
    printings.find(
      (printing) =>
        printing.id === cardId && printing.foiling === invertFoiling(foiling)
    )?.image_url || undefined
  );
};

export default getPrintingImageUrl;
