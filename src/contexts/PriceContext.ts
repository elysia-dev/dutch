import { createContext } from 'react';

export interface IPriceContext {
  elPrice: number;
  ethPrice: number;
  gasPrice: string;
}

export const initialPriceContext = {
  elPrice: 0,
  ethPrice: 0,
  gasPrice: '0'
}

const PriceContext = createContext<IPriceContext>(initialPriceContext);

export default PriceContext;