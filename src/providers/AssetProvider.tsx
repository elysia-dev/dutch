import { BigNumber, utils } from 'ethers';
import React, { useContext, useEffect } from 'react';
import { useState } from "react";
import EspressoV1 from '../api/EspressoV1';
import EspressoV2 from '../api/EspressoV2';
import AssetContext, { initialAssetState, AssetStateType } from '../contexts/AssetContext';
import PriceContext from '../contexts/PriceContext';
import UserContext from '../contexts/UserContext';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import ProviderType from '../enums/ProviderType';
import SignInStatus from '../enums/SignInStatus';
import Asset from '../types/Asset';
import { bscProvider, getElysiaContract, provider, getAssetTokenContract, getBscAssetTokenContract, getAssetTokenEthContract } from '../utiles/getContract';
import PreferenceContext from '../contexts/PreferenceContext';
import LocaleType from '../enums/LocaleType';
import PaymentCryptoType from '../enums/PaymentCryptoType';

import { ethers } from "ethers";

const AssetProvider: React.FC = (props) => {
  const { user, isWalletUser, ownerships, signedIn } = useContext(UserContext);
  const { wallet, isUnlocked } = useContext(WalletContext);
  const { priceLoaded } = useContext(PriceContext);
  const { language } = useContext(PreferenceContext);
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
      const res = await EspressoV1.getAllProduct();
      const assets = await Promise.all(res.data.filter((product) => product.contractAddress)
        .map(async (product) => {
          const assetToken = product.paymentMethod === PaymentCryptoType.BNB ? 
          getBscAssetTokenContract(product?.contractAddress || '')
          : getAssetTokenContract(product?.contractAddress || '');
          const balance: BigNumber = await assetToken?.balanceOf(wallet?.getFirstAddress() || '');
          return {
            title: product.data.descriptions[language || LocaleType.EN]?.title,
            value: parseFloat(utils.formatEther(balance)),
            type: CryptoType.ELA,
            unit: product.tokenName,
            address: product.contractAddress,
            image: product.data.images[0],
            paymentMethod: product.paymentMethod
          } as Asset
        })
      )
      assets.push(
        {
          title: 'ELYSIA',
          value: parseFloat(utils.formatEther(await getElysiaContract()?.balanceOf(wallet?.getFirstAddress() || ''))),
          type: CryptoType.EL,
          unit: CryptoType.EL,
        },
        {
          title: 'ETH',
          value: parseFloat(utils.formatEther(await provider.getBalance(wallet?.getFirstAddress() || ''))),
          type: CryptoType.ETH,
          unit: CryptoType.ETH,
        },
        {
          title: 'BNB (BSC)',
          value: parseFloat(utils.formatEther(await bscProvider.getBalance(wallet?.getFirstAddress() || ''))),
          type: CryptoType.BNB,
          unit: CryptoType.BNB,
        }
      );

      setState({
        assetLoaded: true,
        assets: assets,
      })
    } catch (e) {
      alert('Server Error');
      setState({
        ...state,
        assetLoaded: true
      })
    }
  }

  const loadV1UserBalances = async (noCache?: boolean) => {
    const address = user.ethAddresses[0];

    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({
        ...state,
        assetLoaded: true,
      })

      return
    };
    const assets = ownerships.map((ownership) => {
      return {
        title: ownership.product.data.descriptions[language || LocaleType.EN]?.title,
        value: ownership.tokenValue,
        type: CryptoType.ELA,
        unit: CryptoType.ELA,
        ownershipId: ownership.id,
        isLegacyOwnership: ownership.isLegacy,
        image: ownership.product.data.images[0],
        paymentMethod: ownership.product.paymentMethod
      } as Asset
    })

    try {
      if (address === undefined) {
        setState({
          ...state,
          assetLoaded: true,
        })
        
        return;
      }
    }
    finally {
      assets.push(
        {
          title: 'ELYSIA',
          value: parseFloat(utils.formatEther(await getElysiaContract()?.balanceOf(address || ''))),
          type: CryptoType.EL,
          unit: CryptoType.EL
        },
        {
          title: 'ETH',
          value: parseFloat(utils.formatEther(await provider.getBalance(address || ''))),
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
  }, [signedIn, isWalletUser, isUnlocked, priceLoaded, language])

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
        balance = await getElysiaContract()?.balanceOf(wallet?.getFirstAddress() || '');
        break;
      default:
        balance = BigNumber.from('0');
        break;
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