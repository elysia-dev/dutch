function isNumericStringAppendable(
  existingValue: string,
  appendedValue: string,
  maximumIntegerDigits: number,
  maximumFractionDigits: number,
) {
  const includesComma = existingValue.includes('.');
  if (
    (appendedValue === '.' && includesComma) ||
    (appendedValue !== '.' &&
      !includesComma &&
      existingValue.length >= maximumIntegerDigits) ||
    (includesComma &&
      existingValue.split('.')[1].length >= maximumFractionDigits) ||
    (existingValue.split('').reduce((res, cur) => res && cur === '0', true) &&
      appendedValue === '0')
  ) {
    return false;
  } else {
    return true;
  }
}

export default isNumericStringAppendable;
