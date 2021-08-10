import { createContext } from 'react';
import CryptoType from '../enums/CryptoType';

export type PriceState = {
  elPrice: number
  ethPrice: number
  bnbPrice: number;
  gasPrice: string;
  bscGasPrice: string;
  priceLoaded: boolean;
}

export interface IPriceContext extends PriceState {
  getCryptoPrice: (cryptoType: CryptoType | 'NONE') => number
}

export const initialPriceState = {
  ethPrice: 1679251,
  elPrice: 0.009799,
  bnbPrice: 276.64,
  gasPrice: '6800000000',
  bscGasPrice: '19950000000',
  priceLoaded: false,
}

export const initialPriceContext = {
  ...initialPriceState,
  getCryptoPrice: (_cryptoType: CryptoType | 'NONE') => 0,
}

const PriceContext = createContext<IPriceContext>(initialPriceContext);

export default PriceContext;
