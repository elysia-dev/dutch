import { createContext } from 'react';
import Asset from '../types/Asset';
import CryptoType from '../enums/CryptoType';

export type AssetStateType = {
  assets: Asset[]
  assetLoaded: boolean
};

export interface IAssetContext extends AssetStateType {
  loadV2UserBalances: (cacheControl?: boolean) => Promise<void>
  loadV1UserBalances: (cacheControl?: boolean) => Promise<void>
}

export const initialAssetState = {
  assets: [
    { title: 'EL', currencyValue: 0, unitValue: 0, type: CryptoType.EL, unit: 'EL' },
    { title: 'ETH', currencyValue: 0, unitValue: 0, type: CryptoType.ETH, unit: 'ETH' },
  ],
  assetLoaded: false
}

export const initialAssetContext = {
  ...initialAssetState,
  loadV2UserBalances: async () => { },
  loadV1UserBalances: async () => { },
}

const AssetContext = createContext<IAssetContext>(initialAssetContext);

export default AssetContext;
