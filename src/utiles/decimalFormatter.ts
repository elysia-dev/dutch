const decimalFormatter = (num: number, place: number) => {
  const str = String(num);
  if (str.indexOf('.') !== -1 && str.indexOf('.') <= str.length-(place+1)) {
    return String(num.toFixed(2));
  } else {
    return str;
  }
}

export default decimalFormatter;