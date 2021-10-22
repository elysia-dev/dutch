import { useContext, useState, useEffect } from 'react';
import { utils } from 'ethers';
import AssetContext from '../contexts/AssetContext';
import PriceContext from '../contexts/PriceContext';
import TransactionContext from '../contexts/TransactionContext';
import { getAssetTokenFromCryptoType } from '../utiles/getContract';
import CryptoType from '../enums/CryptoType';
import TxStatus from '../enums/TxStatus';
import getPaymentCrypto from '../utiles/getPaymentCrypto';
import useUserAddress from './useUserAddress';
import StakingContext from '../contexts/StakingContext';
import LoadDetail from '../utiles/LoadLagacyDetail';
import UserContext from '../contexts/UserContext';
import Asset from '../types/Asset';

const useUserTotalAsset = () => {
  const userAddress = useUserAddress();
  const { assets } = useContext(AssetContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const crytoTypes = [
    CryptoType.EL,
    CryptoType.ETH,
    CryptoType.BNB,
    CryptoType.ELFI,
    CryptoType.DAI,
  ];
  const [totalAsset, setTotalAsset] = useState({
    totalInterest: 0,
  });
  const {
    elStakingList,
    elStakingRewards,
    elfiStakingList,
    elfiStakingRewards,
  } = useContext(StakingContext);
  const loadDetail = new LoadDetail();
  const { Server } = useContext(UserContext);

  const [realEstateAssets, setRealEstateAssets] = useState<Asset[]>([]);

  // 부동산 이자 총액
  const getTotalInterest = async () => {
    if (!userAddress) return 0;

    const promises = realEstateAssets.map(async (asset) => {
      if (asset.address) {
        const contract = getAssetTokenFromCryptoType(
          getPaymentCrypto(asset.paymentMethod!),
          asset.address,
        );
        const interest = await contract?.getReward(userAddress);
        return Number(utils.formatEther(interest));
      } else {
        // legacy
        const assetDetail = await loadDetail.ownershipDetail(
          Server,
          asset.ownershipId!,
          1,
          () => {},
        );
        return assetDetail.reward;
      }
    });

    const interests = await Promise.all(promises);
    return interests.reduce((res, cur) => res + cur, 0);
  };

  // 스테이킹 원금 총액
  const getTotalPrincipal = () => {
    const elStaking = elStakingList.map((data) => {
      return (
        parseFloat(utils.formatEther(data.userPrincipal)) *
        getCryptoPrice(CryptoType.EL)
      );
    });

    const elfiStaking = elfiStakingList.map((data) => {
      return (
        parseFloat(utils.formatEther(data.userPrincipal)) *
        getCryptoPrice(CryptoType.ELFI)
      );
    });

    return [...elStaking, ...elfiStaking].reduce((res, cur) => res + cur, 0);
  };

  // 스테이킹 보상 총액
  const getTotalReward = () => {
    const elReward = elStakingRewards.map((reward) => {
      return (
        parseFloat(utils.formatEther(reward)) * getCryptoPrice(CryptoType.ELFI)
      );
    });

    const elfiReward = elfiStakingRewards.map((reward) => {
      return (
        parseFloat(utils.formatEther(reward)) * getCryptoPrice(CryptoType.DAI)
      );
    });

    return [...elReward, ...elfiReward].reduce((res, cur) => res + cur, 0);
  };

  useEffect(() => {
    setRealEstateAssets(
      assets.filter((asset) => {
        if (asset.productId && asset.value <= 0) {
          return true;
        }
        return asset.type === CryptoType.ELA && asset.value > 0;
      }),
    );
  }, [assets]);

  useEffect(() => {
    if (!realEstateAssets.length) return;

    const getTotalAsset = async () => {
      const totalInterest = await getTotalInterest();
      setTotalAsset({ totalInterest });
    };

    getTotalAsset();
  }, [realEstateAssets]);

  return {
    ...totalAsset,
    totalRealEstate: realEstateAssets.reduce(
      (res, cur) => cur.value * getCryptoPrice(cur.type) + res,
      0,
    ),
    totalPrincipal: getTotalPrincipal(),
    totalReward: getTotalReward(),
    totalWallet: assets
      .filter((asset) => crytoTypes.includes(asset.type))
      .reduce((res, cur) => cur.value * getCryptoPrice(cur.type) + res, 0),
  };
};

export default useUserTotalAsset;
