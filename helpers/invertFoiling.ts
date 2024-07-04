const invertFoiling = (foiling: string | null) => {
  if (foiling === "Cold Foil") return "C";
  if (foiling === "Rainbow Foil") return "R";
  if (foiling === "Normal" || !foiling) return "S";
};

export default invertFoiling;
