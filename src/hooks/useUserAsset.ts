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

const useUserAsset = () => {
  const userAddress = useUserAddress();
  const { assets } = useContext(AssetContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { transactions } = useContext(TransactionContext);
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
  const realEstateAssets = assets.filter((item) => {
    if (
      item.productId &&
      transactions[0]?.productId === item.productId &&
      transactions[0].status === TxStatus.Pending &&
      item.value <= 0
    ) {
      return true;
    }
    return item.type === CryptoType.ELA && item.value > 0;
  });
  const {
    elStakingList,
    elStakingRewards,
    elfiStakingList,
    elfiStakingRewards,
  } = useContext(StakingContext);

  // 부동산 이자 총액. 이것도 assetProvider로 넘겨야 하나..??
  const getTotalInterest = async () => {
    if (!userAddress) return 0;

    const promises = realEstateAssets.map(async (item) => {
      const contract = getAssetTokenFromCryptoType(
        getPaymentCrypto(item.paymentMethod!),
        item.address!,
      );
      const interest = await contract?.getReward(userAddress);
      return Number(utils.formatEther(interest));
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
    const getTotalAsset = async () => {
      const totalInterest = await getTotalInterest();

      setTotalAsset({
        totalInterest,
      });
    };

    getTotalAsset();
  }, []);

  return {
    ...totalAsset,
    totalRealEstate: realEstateAssets.reduce(
      (res, cur) => cur.value * getCryptoPrice(cur.type) + res,
      0,
    ),
    totalPrincipal: getTotalPrincipal(),
    totalReward: getTotalReward(),
    totalWallet: assets
      .filter((item) => crytoTypes.includes(item.type))
      .reduce((res, cur) => cur.value * getCryptoPrice(cur.type) + res, 0),
  };
};

export default useUserAsset;