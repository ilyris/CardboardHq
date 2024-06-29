const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
  
    const monthOptions = { month: 'long' };
    const month = new Intl.DateTimeFormat('en-US', monthOptions).format(date);
  
    const year = date.getUTCFullYear();
    const day = date.getUTCDate();
    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
  
    return `${month} ${dayWithSuffix}, ${year}`;
  };

  export default formatDate;