import { useEffect, useState } from 'react';
import CoingeckoClient from '../api/CoingeckoClient';

type Prices = {
  ethPrice: number;
  elPrice: number;
};

function usePrices(): Prices {
  const [prices, setPrices] = useState<Prices>({
    ethPrice: 0,
    elPrice: 0,
  });

  useEffect(() => {
    CoingeckoClient.getElAndEthPrice().then((res) => {
      setPrices({
        ethPrice: res.data.ethereum.usd,
        elPrice: res.data.elysia.usd,
      });
    });
  }, []);

  return prices;
}

export default usePrices;
