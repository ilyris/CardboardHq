import theme from "@/app/theme";
import Chip from "@mui/material/Chip";
import React from "react";

interface CardFoilingChipProps {
  foiling: "Normal" | "Cold Foil" | "Rainbow Foil";
}
const shortenFoilingLabel = (
  foiling: "Normal" | "Cold Foil" | "Rainbow Foil"
) => {
  if (foiling === "Normal") return "NF";
  if (foiling === "Rainbow Foil") return "RF";
  if (foiling === "Cold Foil") return "CF";
};

const foilingChipStyles = (foilingLabel: string | undefined) => {
  switch (foilingLabel) {
    case "Rainbow Foil":
      return {
        background:
          "linear-gradient(to right, rgba(63, 218, 216, 1) 0%, rgba(47, 201, 226, 1) 25%, rgba(28, 127, 238, 1) 50%, rgba(95, 21, 242, 1) 75%, rgba(186, 12, 248, 1) 100%)",
        color: "#fff",
      };
    case "Cold Foil":
      return {
        backgroundColor: "#ffea65",
        color: theme.palette.background.default,
      };
    default:
      return { backgroundColor: theme.palette.primary.main };
  }
};
const CardFoilingChip: React.FC<CardFoilingChipProps> = ({ foiling }) => {
  const chipStyles = foilingChipStyles(foiling);
  const chipLabel = shortenFoilingLabel(foiling);
  return <Chip label={chipLabel} sx={{ ...chipStyles, height: "20px" }} />;
};
export default CardFoilingChip;
