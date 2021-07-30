const decimalFormatter = (num: number, place: number) => {
  const str = String(num);
  if (str.indexOf('.') !== -1 && str.indexOf('.') <= str.length - (place + 1)) {
    return String(num.toFixed(place));
  } else {
    return str;
  }
};

export default decimalFormatter;
