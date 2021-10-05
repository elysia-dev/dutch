import { useContext, useState, useEffect } from 'react';
import { utils, BigNumber } from 'ethers';
import AssetContext from '../contexts/AssetContext';
import PriceContext from '../contexts/PriceContext';
import TransactionContext from '../contexts/TransactionContext';
import { getAssetTokenFromCryptoType } from '../utiles/getContract';
import CryptoType from '../enums/CryptoType';
import TxStatus from '../enums/TxStatus';
import useStakingPool from './useStakingPool';
import { NUMBER_OF_ROUNDS } from '../constants/staking';
import range from '../utiles/range';
import getPaymentCrypto from '../utiles/getPaymentCrypto';
import useUserAddress from './useUserAddress';

const useUserAsset = () => {
  const userAddress = useUserAddress();
  const { assets } = useContext(AssetContext);
  const { getCryptoPrice } = useContext(PriceContext);
  const { transactions } = useContext(TransactionContext);
  const elContract = useStakingPool(CryptoType.EL);
  const elfiContract = useStakingPool(CryptoType.ELFI);
  const elfiV2Contract = useStakingPool(CryptoType.ELFI, true);
  const crytoTypes = [
    CryptoType.EL,
    CryptoType.ETH,
    CryptoType.BNB,
    CryptoType.ELFI,
    CryptoType.DAI,
  ];
  const stakingRounds = range(1, NUMBER_OF_ROUNDS, 1);
  const [asyncAsset, setAsyncAsset] = useState({
    totalInterest: 0,
    totalPrincipal: 0,
    totalReward: 0,
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

  const getFiatFromBigNumber = (value: BigNumber, unit: CryptoType) => {
    return parseFloat(utils.formatEther(value)) * getCryptoPrice(unit);
  };

  const getRealEstate = () => {
    return realEstateAssets.reduce(
      (res, cur) => cur.value * getCryptoPrice(cur.type) + res,
      0,
    );
  };

  const getRealEstateInterest = async () => {
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

  const getStaking = async () => {
    const elStakingPromises = stakingRounds.map(async (round) => {
      const userData = await elContract.getUserData(round, userAddress);
      return getFiatFromBigNumber(userData.userPrincipal, CryptoType.EL);
    });

    const elfiStakingPromises = stakingRounds.map(async (round) => {
      const contract = round > 2 ? elfiV2Contract : elfiContract;
      const changedRound = round > 2 ? round - 2 : round;
      const userData = await contract.getUserData(changedRound, userAddress);
      return getFiatFromBigNumber(userData.userPrincipal, CryptoType.ELFI);
    });

    const elStaking = await Promise.all(elStakingPromises);
    const elfiStaking = await Promise.all(elfiStakingPromises);
    return [...elStaking, ...elfiStaking].reduce((res, cur) => res + cur, 0);
  };

  const getStakingReward = async () => {
    const elRewardPromises = stakingRounds.map(async (round) => {
      const rewardAmount = await elContract.getUserReward(userAddress, round);
      return getFiatFromBigNumber(rewardAmount, CryptoType.ELFI);
    });

    const elfiRewardPromises = stakingRounds.map(async (round) => {
      const contract = round > 2 ? elfiV2Contract : elfiContract;
      const changedRound = round > 2 ? round - 2 : round;
      const rewardAmount = await contract.getUserReward(
        userAddress,
        changedRound,
      );
      return getFiatFromBigNumber(rewardAmount, CryptoType.DAI);
    });

    const elReward = await Promise.all(elRewardPromises);
    const elfiReward = await Promise.all(elfiRewardPromises);
    return [...elReward, ...elfiReward].reduce((res, cur) => res + cur, 0);
  };

  const getWallet = () => {
    return assets
      .filter((item) => crytoTypes.includes(item.type))
      .reduce((res, cur) => cur.value * getCryptoPrice(cur.type) + res, 0);
  };

  useEffect(() => {
    const getAsyncAsset = async () => {
      const totalInterest = await getRealEstateInterest();
      const totalPrincipal = await getStaking();
      const totalReward = await getStakingReward();

      setAsyncAsset({
        totalInterest,
        totalPrincipal,
        totalReward,
      });
    };

    getAsyncAsset();
  }, []);

  return {
    ...asyncAsset,
    totalRealEstate: getRealEstate(),
    totalWallet: getWallet(),
  };
};

export default useUserAsset;
