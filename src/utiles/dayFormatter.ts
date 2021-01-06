const dayFormatter = (day: number) => {
  if (day >= 0) {
    return day;
  } else {
    return day + 7;
  }
};

export default dayFormatter;
