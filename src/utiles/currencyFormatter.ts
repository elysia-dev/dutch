import commaFormatter from './commaFormatter';

const currencyFormatter = (
  currencyUnit: string,
  currencyRatio: number,
  usdValue: number,
  fix: number,
) => {
  const convertedValue = parseFloat(`${usdValue * currencyRatio}`);

  if (convertedValue > 0 && convertedValue < 0.1 ** fix) {
    return `${currencyUnit} 0.${'0'.repeat(fix)}...`;
  } else {
    return `${currencyUnit} ${commaFormatter(
      convertedValue.toFixed(currencyUnit === '₩' ? 0 : fix),
    )}`;
  }
};

export default currencyFormatter;
