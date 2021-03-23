import { createContext } from 'react';
import CurrencyType from '../enums/CurrencyType';
import LocaleType from '../enums/LocaleType';

export interface IPriceContext {
  elPrice: number;
  ethPrice: number;
}

export const initialPriceContext = {
  elPrice: 0,
  ethPrice: 0
}

const PriceContext = createContext<IPriceContext>(initialPriceContext);

export default PriceContext;
