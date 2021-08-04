import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import CoingeckoClient from '../api/CoingeckoClient';
import { PRICE_DATA } from '../constants/storage';
import PriceContext, {
  PriceState,
  initialPriceState,
} from '../contexts/PriceContext';
import CryptoType from '../enums/CryptoType';
import { provider, bscProvider } from '../utiles/getContract';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<PriceState>(initialPriceState);

  const loadPrices = async () => {
    let priceData = JSON.parse(
      (await AsyncStorage.getItem(PRICE_DATA)) ||
        JSON.stringify(initialPriceState),
    ) as PriceState;

    try {
      const priceRes = await CoingeckoClient.getElAndEthPrice();

      priceData = {
        ethPrice: priceRes.data.ethereum.usd,
        elPrice: priceRes.data.elysia.usd,
        bnbPrice: priceRes.data.binancecoin.usd,
        daiPrice: priceRes.data.dai.usd,
        gasPrice: (await provider.getGasPrice()).toString(),
        bscGasPrice: (await bscProvider.getGasPrice()).toString(),
        priceLoaded: true,
      };
    } finally {
      await AsyncStorage.setItem(PRICE_DATA, JSON.stringify(priceData));

      setState({
        ...priceData,
        priceLoaded: true,
      });
    }
  };

  const getCryptoPrice = (cryptoType: CryptoType): number => {
    switch (cryptoType) {
      case CryptoType.BNB:
        return state.bnbPrice;
      case CryptoType.EL:
        return state.elPrice;
      case CryptoType.ETH:
        return state.ethPrice;
      case CryptoType.ELA:
        // Fix ELA $5
        return 5;
      case CryptoType.DAI:
        return state.daiPrice;
      default:
        return 0;
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <PriceContext.Provider
      value={{
        ...state,
        getCryptoPrice,
      }}>
      {props.children}
    </PriceContext.Provider>
  );
};

export default PriceProvider;
