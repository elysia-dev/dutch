import { createContext } from 'react';
import CryptoType from '../enums/CryptoType';

export type PriceState = {
  elPrice: number;
  ethPrice: number;
  bnbPrice: number;
  elfiPrice: number;
  daiPrice: number;
  gasPrice: string;
  bscGasPrice: string;
  priceLoaded: boolean;
};

export interface IPriceContext extends PriceState {
  getCryptoPrice: (cryptoType: CryptoType) => number;
}

export const initialPriceState = {
  ethPrice: 1679251,
  elPrice: 0.009799,
  bnbPrice: 276.64,
  elfiPrice: 1,
  daiPrice: 1,
  gasPrice: '6800000000',
  bscGasPrice: '19950000000',
  priceLoaded: false,
};

export const initialPriceContext = {
  ...initialPriceState,
  getCryptoPrice: (_cryptoType: CryptoType) => 0,
};

const PriceContext = createContext<IPriceContext>(initialPriceContext);

export default PriceContext;
