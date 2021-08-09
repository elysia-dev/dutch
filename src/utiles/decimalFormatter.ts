const decimalFormatter = (num: number, place: number) => {
  let str = String(num);

  if (str.indexOf('.') !== -1 && str.indexOf('.') <= str.length - (place + 1)) {
    str = String(num.toFixed(place));
  }

  if (str.indexOf('.') !== -1) {
    for (let i = str.length - 1; i > 0; i--) {
      if (str[i] === '0') {
        str = str.slice(0, -1);
      } else {
        break;
      }
    }
  }

  return str;
};

export default decimalFormatter;
