import commaFormatter from './commaFormatter';

const currencyFormatter = (
  currencyUnit: string,
  currencyRatio: number,
  usdValue: number,
  fix: number,
) => {
  return `${currencyUnit} ${commaFormatter(
    parseFloat(`${usdValue * currencyRatio}`).toFixed(fix),
  )}`;
};

export default currencyFormatter;
