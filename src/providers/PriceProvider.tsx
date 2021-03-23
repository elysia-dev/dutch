import React, { useEffect } from 'react';
import { useState } from "react";
import CoingeckoClient from '../api/CoingeckoClient';
import PriceContext, { IPriceContext, initialPriceContext } from '../contexts/PriceContext';
import { provider } from '../utiles/getContract';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<IPriceContext>(initialPriceContext)

  const loadPrices = async () => {
    const priceData = await CoingeckoClient.getElAndEthPrice();

    const gasPrice = await provider.getGasPrice();
    setState({
      ethPrice: priceData.data.ethereum.usd,
      elPrice: priceData.data.elysia.usd,
      gasPrice: gasPrice.toString(),
    })
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