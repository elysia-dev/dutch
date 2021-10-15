import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import StakingContext, {
  StakingStateType,
  initialStakingState,
} from '../contexts/StakingContext';
import UserContext from '../contexts/UserContext';
import PriceContext from '../contexts/PriceContext';
import useUserAddress from '../hooks/useUserAddress';
import SignInStatus from '../enums/SignInStatus';
import { NUMBER_OF_ROUNDS } from '../constants/staking';
import range from '../utiles/range';
import useStakingPool from '../hooks/useStakingPool';
import CryptoType from '../enums/CryptoType';
import ProviderType from '../enums/ProviderType';
import WalletContext from '../contexts/WalletContext';
import PreferenceContext from '../contexts/PreferenceContext';

const StakingProvider: React.FC = ({ children }) => {
  const { signedIn, user, isWalletUser } = useContext(UserContext);
  const { priceLoaded } = useContext(PriceContext);
  const { isUnlocked } = useContext(WalletContext);
  const { language } = useContext(PreferenceContext);
  const userAddress = useUserAddress();
  const stakingRounds = range(1, NUMBER_OF_ROUNDS, 1);
  const elContract = useStakingPool(CryptoType.EL);
  const elfiContract = useStakingPool(CryptoType.ELFI);
  const elfiV2Contract = useStakingPool(CryptoType.ELFI, true);
  const [state, setState] = useState<StakingStateType>(initialStakingState);
  const { t } = useTranslation();

  const getElStakingList = async () => {
    const elStakingPromises = stakingRounds.map(async (round) => {
      const userData = await elContract.getUserData(round, userAddress!);
      return userData;
    });

    const elStakingList = await Promise.all(elStakingPromises);
    return elStakingList;
  };

  const getElfiStakingList = async () => {
    const elfiStakingPromises = stakingRounds.map(async (round) => {
      const contract = round > 2 ? elfiV2Contract : elfiContract;
      const changedRound = round > 2 ? round - 2 : round;
      const userData = await contract.getUserData(changedRound, userAddress!);
      return userData;
    });

    const elfiStakingList = await Promise.all(elfiStakingPromises);
    return elfiStakingList;
  };

  const getElStakingRewards = async () => {
    const elRewardPromises = stakingRounds.map(async (round) => {
      const rewardAmount = await elContract.getUserReward(userAddress!, round);
      return rewardAmount;
    });

    const elStakingRewards = await Promise.all(elRewardPromises);
    return elStakingRewards;
  };

  const getElfiStakingRewards = async () => {
    const elfiRewardPromises = stakingRounds.map(async (round) => {
      const contract = round > 2 ? elfiV2Contract : elfiContract;
      const changedRound = round > 2 ? round - 2 : round;
      const rewardAmount = await contract.getUserReward(
        userAddress!,
        changedRound,
      );
      return rewardAmount;
    });

    const elfiStakingRewards = await Promise.all(elfiRewardPromises);
    return elfiStakingRewards;
  };

  const loadStakingInfo = async () => {
    try {
      const elStakingList = await getElStakingList();
      const elfiStakingList = await getElfiStakingList();
      const elStakingRewards = await getElStakingRewards();
      const elfiStakingRewards = await getElfiStakingRewards();

      setState({
        elStakingList,
        elfiStakingList,
        elStakingRewards,
        elfiStakingRewards,
        stakingLoaded: true,
      });
    } catch (e) {
      alert(t('staking.failed_to_load'));
      setState({ ...initialStakingState, stakingLoaded: true });
    }
  };

  useEffect(() => {
    if (signedIn !== SignInStatus.SIGNIN || !priceLoaded) {
      setState(initialStakingState);
      return;
    }

    if (user.provider === ProviderType.GUEST && !isWalletUser) {
      setState({ ...initialStakingState, stakingLoaded: true });
      return;
    }

    if (userAddress) {
      loadStakingInfo();
    }
  }, [signedIn, priceLoaded, isWalletUser, isUnlocked, language]);

  return (
    <StakingContext.Provider value={{ ...state, loadStakingInfo }}>
      {children}
    </StakingContext.Provider>
  );
};

export default StakingProvider;
