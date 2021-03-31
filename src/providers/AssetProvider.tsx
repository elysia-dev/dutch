import React, { useContext, useEffect } from 'react';
import { useState } from "react";
import EspressoV2 from '../api/EspressoV2';
import AssetContext, { initialAssetState, AssetStateType } from '../contexts/AssetContext';
import PriceContext from '../contexts/PriceContext';
import UserContext from '../contexts/UserContext';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import ProviderType from '../enums/ProviderType';
import SignInStatus from '../enums/SignInStatus';
import Asset from '../types/Asset';
import assetTokenNamePrettier from '../utiles/assetTokenNamePrettier';

const AssetProvider: React.FC = (props) => {
  const { user, isWalletUser, ownerships, signedIn } = useContext(UserContext);
  const { wallet, isUnlocked } = useContext(WalletContext);
  const { elPrice, ethPrice, bnbPrice, priceLoaded } = useContext(PriceContext);
  const [state, setState] = useState<AssetStateType>(initialAssetState)

  const loadV2UserBalances = async (noCache?: boolean) => {
    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({
        ...state,
        assetLoaded: true,
      })

      return
    };

    try {
      const { data } = await EspressoV2.getBalances(wallet?.getFirstNode()?.address || '', noCache);

      const assets = data.tokens.filter((token) => ![CryptoType.ETH, CryptoType.EL, CryptoType.BNB].includes(token.symbol as CryptoType))
        .map((token) => {
          return {
            title: assetTokenNamePrettier(token.name),
            currencyValue: token.balance * 5,
            unitValue: token.balance,
            type: CryptoType.ELA,
            unit: token.symbol,
            address: token.address,
          } as Asset
        })

      const elBalance = data.tokens.find((token) => token.symbol === CryptoType.EL)?.balance || 0

      assets.push(
        {
          title: 'Elysia',
          currencyValue: elBalance * elPrice,
          unitValue: elBalance,
          type: CryptoType.EL,
          unit: CryptoType.EL,
        },
        {
          title: 'ETH',
          currencyValue: data.ethBalance * ethPrice,
          unitValue: data.ethBalance,
          type: CryptoType.ETH,
          unit: CryptoType.ETH,
        },
        {
          title: 'BNB (BSC)',
          currencyValue: data.bnbBalance * bnbPrice,
          unitValue: data.bnbBalance,
          type: CryptoType.BNB,
          unit: CryptoType.BNB,
        }
      );

      setState({
        assetLoaded: true,
        assets: assets,
      })
    } catch {
      alert('Server Error');
      setState({
        ...state,
        assetLoaded: true
      })
    }
  }

  const loadV1UserBalances = async (noCache?: boolean) => {
    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({
        ...state,
        assetLoaded: true,
      })

      return
    };

    const assets = ownerships.map((ownership) => {
      return {
        title: ownership.title,
        currencyValue: ownership.tokenValue * 5, // * asset token is 5usd
        unitValue: ownership.tokenValue,
        type: CryptoType.ELA,
        unit: CryptoType.ELA,
        ownershipId: ownership.id,
        isLegacyOwnership: ownership.isLegacy
      } as Asset
    })

    let elBalance = 0;
    let ethBalance = 0;

    try {
      const { data } = await EspressoV2.getBalances(user.ethAddresses[0] || '', noCache);

      elBalance = data.tokens.find((token) => token.symbol === CryptoType.EL)?.balance || 0;
      ethBalance = data.ethBalance || 0;

    } finally {
      assets.push(
        {
          title: 'Elysia',
          currencyValue: elBalance * elPrice,
          unitValue: elBalance,
          type: CryptoType.EL,
          unit: CryptoType.EL
        },
        {
          title: 'ETH',
          currencyValue: ethBalance * ethPrice,
          unitValue: ethBalance,
          type: CryptoType.ETH,
          unit: CryptoType.ETH
        }
      )

      setState({
        assetLoaded: true,
        assets: assets,
      })
    }
  }

  useEffect(() => {
    if (signedIn !== SignInStatus.SIGNIN || !priceLoaded) {
      setState(initialAssetState)
      return;
    };

    if (isWalletUser && isUnlocked) {
      loadV2UserBalances()
      return;
    }

    loadV1UserBalances()
  }, [signedIn, isWalletUser, isUnlocked, priceLoaded])

  const getBalance = (unit: string): number => {
    return state.assets.find((asset) => asset.unit === unit)?.unitValue || 0
  }

  return (
    <AssetContext.Provider
      value={{
        ...state,
        loadV1UserBalances,
        loadV2UserBalances,
        getBalance,
      }}
    >
      {props.children}
    </AssetContext.Provider>
  );
}

export default AssetProvider;