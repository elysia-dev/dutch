import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react';
import { useState } from "react";
import CoingeckoClient from '../api/CoingeckoClient';
import { PRICE_DATA } from '../constants/storage';
import PriceContext, { IPriceContext, initialPriceContext } from '../contexts/PriceContext';
import { provider } from '../utiles/getContract';

interface PriceData {
  ethPrice: number
  elPrice: number
  gasPrice: string
}

const defaultPrices = {
  ethPrice: 1679251,
  elPrice: 0.009799,
  gasPrice: '6800000000',
}

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<IPriceContext>(initialPriceContext)

  const loadPrices = async () => {
    let priceData = JSON.parse((await AsyncStorage.getItem(PRICE_DATA)) || JSON.stringify(defaultPrices)) as PriceData;
    let ethPrice = priceData.ethPrice;
    let elPrice = priceData.elPrice;
    let gasPrice = priceData.gasPrice;

    try {
      const priceData = await CoingeckoClient.getElAndEthPrice();
      ethPrice = priceData.data.ethereum.usd;
      elPrice = priceData.data.elysia.usd;
      gasPrice = (await provider.getGasPrice()).toString();
    } finally {
      await AsyncStorage.setItem(PRICE_DATA, JSON.stringify({ ethPrice, elPrice, gasPrice }))

      setState({
        ethPrice,
        elPrice,
        gasPrice,
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