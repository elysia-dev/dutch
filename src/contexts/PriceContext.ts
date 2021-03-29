import { createContext } from 'react';

export interface IPriceContext {
  elPrice: number;
  ethPrice: number;
  bnbPrice: number;
  gasPrice: string;
  bscGasPrice: string;
  priceLoaded: boolean;
}

export const initialPriceContext = {
  elPrice: 0,
  ethPrice: 0,
  bnbPrice: 0,
  gasPrice: '0',
  bscGasPrice: '0',
  priceLoaded: false,
}

const PriceContext = createContext<IPriceContext>(initialPriceContext);

export default PriceContext;
