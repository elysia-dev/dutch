import { createContext } from 'react';

type CurrencyContextType = {
  elPrice: number;
  krwPrice: number;
  cnyPrice: number;
  currencyUnit: string;
  currencyRatio: number;
};

const CurrencyContext = createContext<CurrencyContextType>({
  elPrice: 0,
  krwPrice: 0,
  cnyPrice: 0,
  currencyUnit: '$',
  currencyRatio: 1,
});

export default CurrencyContext;
