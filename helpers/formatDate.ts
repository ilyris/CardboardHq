const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDate = (isoString: string) => {
  if (!isoString) return;
  const date = new Date(isoString);

  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date
  );

  const year = date.getUTCFullYear();
  const day = date.getUTCDate();
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  return `${month} ${dayWithSuffix}, ${year}`;
};

export default formatDate;
