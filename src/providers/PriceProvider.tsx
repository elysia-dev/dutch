import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react';
import { useState } from "react";
import CoingeckoClient from '../api/CoingeckoClient';
import { PRICE_DATA } from '../constants/storage';
import PriceContext, { IPriceContext, initialPriceContext } from '../contexts/PriceContext';
import { provider, bscProvider } from '../utiles/getContract';

interface PriceData {
  ethPrice: number
  elPrice: number
  bnbPrice: number
  gasPrice: string
  bscGasPrice: string
}

const defaultPrices = {
  ethPrice: 1679251,
  elPrice: 0.009799,
  bnbPrice: 276.64,
  gasPrice: '6800000000',
  bscGasPrice: '19950000000'
}

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<IPriceContext>(initialPriceContext)

  const loadPrices = async () => {
    let priceData = JSON.parse((await AsyncStorage.getItem(PRICE_DATA)) || JSON.stringify(defaultPrices)) as PriceData;

    try {
      const priceRes = await CoingeckoClient.getElAndEthPrice();
      priceData = {
        ethPrice: priceRes.data.ethereum.usd,
        elPrice: priceRes.data.elysia.usd,
        bnbPrice: priceRes.data.binancecoin.usd,
        gasPrice: (await provider.getGasPrice()).toString(),
        bscGasPrice: (await bscProvider.getGasPrice()).toString(),
      }
    } finally {
      await AsyncStorage.setItem(PRICE_DATA, JSON.stringify(priceData))

      setState({
        ...priceData,
        priceLoaded: true,
      })
    }
  }

  useEffect(() => {
    loadPrices();
  }, [])

  return (
    <PriceContext.Provider
      value={{
        ...state
      }}
    >
      {props.children}
    </PriceContext.Provider>
  );
}

export default PriceProvider;