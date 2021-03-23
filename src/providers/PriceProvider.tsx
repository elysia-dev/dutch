import React, { useEffect } from 'react';
import { useState } from "react";
import CoingeckoClient from '../api/CoingeckoClient';
import PriceContext, { IPriceContext, initialPriceContext } from '../contexts/PriceContext';


const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<IPriceContext>(initialPriceContext)

  useEffect(() => {
    CoingeckoClient.getElAndEthPrice().then((res) => {
      setState({
        ethPrice: res.data.ethereum.usd,
        elPrice: res.data.elysia.usd,
      });
    });
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