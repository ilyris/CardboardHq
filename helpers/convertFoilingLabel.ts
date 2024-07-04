const convertFoilingLabel = (foiling: "S" | "C" | "R") => {
  if (foiling === "S") return "Normal";
  if (foiling === "R") return "Rainbow Foil";
  if (foiling === "C") return "Cold Foil";
};

export default convertFoilingLabel;
