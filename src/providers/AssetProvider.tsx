import { BigNumber, utils } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';

import EspressoV1 from '../api/EspressoV1';
import AssetContext, {
  initialAssetState,
  AssetStateType,
} from '../contexts/AssetContext';
import PriceContext from '../contexts/PriceContext';
import UserContext from '../contexts/UserContext';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import ProviderType from '../enums/ProviderType';
import SignInStatus from '../enums/SignInStatus';
import Asset from '../types/Asset';
import {
  bscProvider,
  getElysiaContract,
  provider,
  getAssetTokenContract,
  getBscAssetTokenContract,
  getElfiContract,
  getDaiContract,
} from '../utiles/getContract';
import PreferenceContext from '../contexts/PreferenceContext';
import LocaleType from '../enums/LocaleType';
import PaymentCryptoType from '../enums/PaymentCryptoType';
import useErcContract from '../hooks/useErcContract';

const AssetProvider: React.FC = (props) => {
  const { user, isWalletUser, ownerships, signedIn } = useContext(UserContext);
  const { wallet, isUnlocked } = useContext(WalletContext);
  const { priceLoaded } = useContext(PriceContext);
  const { language } = useContext(PreferenceContext);
  const [state, setState] = useState<AssetStateType>(initialAssetState);
  const { elContract, elfiContract, daiContract } = useErcContract();
  const address = wallet?.getFirstNode()?.address || user.ethAddresses[0];

  const loadV2UserBalances = async (noCache?: boolean) => {
    if (!address) return;

    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({
        ...state,
        assetLoaded: true,
      });

      return;
    }

    try {
      const assets = ownerships
        .filter((ownership) => ownership.isLegacy)
        .map((ownership) => {
          return {
            title:
              ownership.product.data.descriptions[language || LocaleType.EN]
                ?.title,
            value: ownership.tokenValue,
            type: CryptoType.ELA,
            unit: CryptoType.ELA,
            ownershipId: ownership.id,
            isLegacyOwnership: ownership.isLegacy,
            image: ownership.product.data.images[0],
            paymentMethod: ownership.product.paymentMethod,
            productId: ownership.id,
          } as Asset;
        });

      const res = await EspressoV1.getAllProduct();
      const result = await Promise.all(
        res.data
          .filter((product) => product.contractAddress)
          .map(async (product, idx, arr) => {
            const assetToken =
              product.paymentMethod === PaymentCryptoType.BNB
                ? getBscAssetTokenContract(product?.contractAddress || '')
                : getAssetTokenContract(product?.contractAddress || '');
            const balance: BigNumber = await assetToken?.balanceOf(
              wallet?.getFirstAddress() || address,
            );
            return {
              title:
                product.data.descriptions[language || LocaleType.EN]?.title,
              value: parseFloat(utils.formatEther(balance)),
              type: CryptoType.ELA,
              unit: product.tokenName,
              address: product.contractAddress,
              image: product.data.images[0],
              paymentMethod: product.paymentMethod,
              productId: product.id,
            } as Asset;
          }),
      );
      result.forEach((v) => assets.push(v));
      assets.push(
        {
          title: 'ELYSIA',
          value: parseFloat(
            utils.formatEther(
              await elContract?.balanceOf(wallet?.getFirstAddress() || address),
            ),
          ),
          type: CryptoType.EL,
          unit: CryptoType.EL,
        },
        {
          title: 'ETH',
          value: parseFloat(
            utils.formatEther(
              await provider.getBalance(wallet?.getFirstAddress() || address),
            ),
          ),
          type: CryptoType.ETH,
          unit: CryptoType.ETH,
        },
        {
          title: 'BNB (BSC)',
          value: parseFloat(
            utils.formatEther(
              await bscProvider.getBalance(
                wallet?.getFirstAddress() || address,
              ),
            ),
          ),
          type: CryptoType.BNB,
          unit: CryptoType.BNB,
        },
        {
          title: 'ELFI',
          value: parseFloat(
            utils.formatEther(
              await elfiContract?.balanceOf(
                wallet?.getFirstAddress() || address,
              ),
            ),
          ),
          type: CryptoType.ELFI,
          unit: CryptoType.ELFI,
        },
        {
          title: 'DAI',
          value: parseFloat(
            utils.formatEther(
              await daiContract?.balanceOf(
                wallet?.getFirstAddress() || address,
              ),
            ),
          ),
          type: CryptoType.DAI,
          unit: CryptoType.DAI,
        },
      );
      setState({
        assetLoaded: true,
        assets,
      });
    } catch (e) {
      alert('Server Error');
      setState({
        ...state,
        assetLoaded: true,
      });
    }
  };

  const loadV1UserBalances = async (noCache?: boolean) => {
    const address = user.ethAddresses[0];

    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({
        ...state,
        assetLoaded: true,
      });

      return;
    }
    const assets = ownerships
      .filter((ownership) => ownership.isLegacy)
      .map((ownership) => {
        return {
          title:
            ownership.product.data.descriptions[language || LocaleType.EN]
              ?.title,
          value: ownership.tokenValue,
          type: CryptoType.ELA,
          unit: CryptoType.ELA,
          ownershipId: ownership.id,
          isLegacyOwnership: ownership.isLegacy,
          image: ownership.product.data.images[0],
          paymentMethod: ownership.product.paymentMethod,
          productId: ownership.id,
        } as Asset;
      });
    if (address) {
      const res = await EspressoV1.getAllProduct();
      const result = await Promise.all(
        res.data
          .filter((product) => product.contractAddress)
          .map(async (product, idx, arr) => {
            const assetToken =
              product.paymentMethod === PaymentCryptoType.BNB
                ? getBscAssetTokenContract(product?.contractAddress || '')
                : getAssetTokenContract(product?.contractAddress || '');
            const balance: BigNumber = await assetToken?.balanceOf(address);
            return {
              title:
                product.data.descriptions[language || LocaleType.EN]?.title,
              value: parseFloat(utils.formatEther(balance)),
              type: CryptoType.ELA,
              unit: CryptoType.ELA,
              address: product.contractAddress,
              image: product.data.images[0],
              paymentMethod: product.paymentMethod,
              productId: product.id,
            } as Asset;
          }),
      );
      result.forEach((v) => assets.push(v));
    }
    if (address === undefined) {
      setState({
        ...state,
        assetLoaded: true,
        assets: assets || undefined,
      });

      return;
    }
    try {
      assets.push(
        {
          title: 'ELYSIA',
          value: parseFloat(
            utils.formatEther(await elContract?.balanceOf(address || '')),
          ),
          type: CryptoType.EL,
          unit: CryptoType.EL,
        },
        {
          title: 'ETH',
          value: parseFloat(
            utils.formatEther(await provider.getBalance(address || '')),
          ),
          type: CryptoType.ETH,
          unit: CryptoType.ETH,
        },
        {
          title: 'BNB (BSC)',
          value: parseFloat(
            utils.formatEther(await bscProvider.getBalance(address || '')),
          ),
          type: CryptoType.BNB,
          unit: CryptoType.BNB,
        },
        {
          title: 'ELFI',
          value: parseFloat(
            utils.formatEther(await elfiContract?.balanceOf(address || '')),
          ),
          type: CryptoType.ELFI,
          unit: CryptoType.ELFI,
        },
        {
          title: 'DAI',
          value: parseFloat(
            utils.formatEther(await daiContract.balanceOf(address || '')),
          ),
          type: CryptoType.DAI,
          unit: CryptoType.DAI,
        },
      );
    } finally {
      setState({
        assetLoaded: true,
        assets,
      });
    }
  };

  useEffect(() => {
    if (signedIn !== SignInStatus.SIGNIN || !priceLoaded) {
      setState(initialAssetState);
      return;
    }

    if (isWalletUser && isUnlocked) {
      loadV2UserBalances();
      return;
    }

    if (!isWalletUser) {
      loadV1UserBalances();
    }
  }, [signedIn, isWalletUser, isUnlocked, priceLoaded, language]);

  const getBalance = (unit: string): number => {
    return state.assets.find((asset) => asset.unit === unit)?.value || 0;
  };

  const refreshBalance = async (cryptoType: CryptoType): Promise<void> => {
    let balance: BigNumber;

    switch (cryptoType) {
      case CryptoType.BNB:
        balance = await bscProvider.getBalance(wallet?.getFirstAddress() || '');
        break;
      case CryptoType.ETH:
        balance = await provider.getBalance(wallet?.getFirstAddress() || '');
        break;
      case CryptoType.EL:
        balance = await getElysiaContract()?.balanceOf(
          wallet?.getFirstAddress() || '',
        );
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
          };
        } else {
          return asset;
        }
      }),
    });
  };

  return (
    <AssetContext.Provider
      value={{
        ...state,
        loadV1UserBalances,
        loadV2UserBalances,
        getBalance,
        refreshBalance,
      }}>
      {props.children}
    </AssetContext.Provider>
  );
};

export default AssetProvider;
