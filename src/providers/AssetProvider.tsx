import { BigNumber, utils } from 'ethers';
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
import { bscProvider, getElysiaContract, provider } from '../utiles/getContract';

const AssetProvider: React.FC = (props) => {
  const { user, isWalletUser, ownerships, signedIn } = useContext(UserContext);
  const { wallet, isUnlocked } = useContext(WalletContext);
  const { priceLoaded } = useContext(PriceContext);
  const [state, setState] = useState<AssetStateType>(initialAssetState)

  const loadV2UserBalances = async (noCache?: boolean) => {
    const address = wallet?.getFirstNode()?.address;

    if (!address) return

    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({
        ...state,
        assetLoaded: true,
      })

      return
    };

    try {
      const { data } = await EspressoV2.getBalances(address, noCache);

      const assets = data.tokens.filter((token) => ![CryptoType.ETH, CryptoType.EL, CryptoType.BNB].includes(token.symbol as CryptoType))
        .map((token) => {
          return {
            title: assetTokenNamePrettier(token.name),
            value: token.balance,
            type: CryptoType.ELA,
            unit: token.symbol,
            address: token.address,
          } as Asset
        })

      const elBalance = data.tokens.find((token) => token.symbol === CryptoType.EL)?.balance || 0

      assets.push(
        {
          title: 'Elysia',
          value: elBalance,
          type: CryptoType.EL,
          unit: CryptoType.EL,
        },
        {
          title: 'ETH',
          value: data.ethBalance,
          type: CryptoType.ETH,
          unit: CryptoType.ETH,
        },
        {
          title: 'BNB (BSC)',
          value: data.bnbBalance,
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
        value: ownership.tokenValue,
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
          value: elBalance,
          type: CryptoType.EL,
          unit: CryptoType.EL
        },
        {
          title: 'ETH',
          value: ethBalance,
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

    if (!isWalletUser) {
      loadV1UserBalances()
    }
  }, [signedIn, isWalletUser, isUnlocked, priceLoaded])

  const getBalance = (unit: string): number => {
    return state.assets.find((asset) => asset.unit === unit)?.value || 0
  }

  const refreshBalance = async (cryptoType: CryptoType): Promise<void> => {
    let balance: BigNumber

    switch (cryptoType) {
      case CryptoType.BNB:
        balance = await bscProvider.getBalance(wallet?.getFirstAddress() || '');
        break;
      case CryptoType.ETH:
        balance = await provider.getBalance(wallet?.getFirstAddress() || '')
        break;
      case CryptoType.EL:
        balance = await getElysiaContract()?.balanceOf(wallet?.getFirstAddress || '');
      default:
        balance = BigNumber.from('0');
    }

    setState({
      ...state,
      assets: state.assets.map((asset) => {
        if (asset.type === cryptoType) {
          return {
            ...asset,
            value: parseFloat(utils.formatEther(balance)),
          }
        } else {
          return asset
        }
      })
    })
  }

  return (
    <AssetContext.Provider
      value={{
        ...state,
        loadV1UserBalances,
        loadV2UserBalances,
        getBalance,
        refreshBalance,
      }}
    >
      {props.children}
    </AssetContext.Provider>
  );
}

export default AssetProvider;