import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BigNumber, constants, utils } from 'ethers';
import moment from 'moment';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from '../../shared/components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';
import CryptoType from '../../enums/CryptoType';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import { STAKING_POOL_ROUNDS } from '../../constants/staking';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import { Page, StakingPage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import decimalFormatter from '../../utiles/decimalFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import useStakingPool from '../../hooks/useStakingPool';
import useAppState from '../../hooks/useAppState';
import TransactionContext from '../../contexts/TransactionContext';
import getCurrentStakingRound from '../../utiles/getCurrentStakingRound';

type ParamList = {
  TotalDashboard: {
    cryptoType: CryptoType;
    round: number;
  };
};

const TotalDashboard: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'TotalDashboard'>>();
  const { cryptoType, round } = route.params;
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const [selectedRound, setSelectedRound] = useState(round);
  const navigation = useNavigation();
  const [userReward, setUserReward] = useState('-');
  const [userPrincipal, setUserPrincipal] = useState('-');
  const [currentRoundReward, setCurrentRoundReward] = useState('-');
  const { isWalletUser, user } = useContext(UserContext);
  const { isSuccessTx } = useContext(TransactionContext);
  const { wallet } = useContext(WalletContext);
  const address = isWalletUser // 이거 아예 함수로 만들어야겠는데...
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const { t } = useTranslation();
  const stakingPoolContract = useStakingPool(cryptoType);
  const currentRound = getCurrentStakingRound();
  const changedRound =
    cryptoType === CryptoType.EL || selectedRound <= 2
      ? selectedRound
      : selectedRound - 2;
  const [isProgressRound, setIsProgressRound] = useState(false);
  const [isCurrentRound, setIsCurrentRound] = useState(false);
  const [totalPrincipal, setTotalPrincipal] = useState<BigNumber>(
    constants.Zero,
  );
  const [count, setCount] = useState(0);
  const appState = useAppState();

  const formatAmount = (amount: BigNumber) => {
    return commaFormatter(
      decimalFormatter(Number(utils.formatEther(amount)), 5),
    );
  };

  const indicateAmount = (amount: BigNumber) => {
    return amount.toHexString() !== '0x00' ? formatAmount(amount) : '-';
  };

  const getPoolData = async () => {
    const poolData = await stakingPoolContract.getPoolData(changedRound);
    setTotalPrincipal(poolData[4]);
  };

  const getUserData = async () => {
    const userData = await stakingPoolContract.getUserData(
      changedRound,
      address || '',
    );
    const userPrincipal = userData.userPrincipal;
    const userReward = await stakingPoolContract.getUserReward(
      address || '',
      changedRound,
    );

    setCurrentRoundReward(indicateAmount(userReward));
    setUserReward(indicateAmount(userReward));
    setUserPrincipal(indicateAmount(userPrincipal));
  };

  useEffect(() => {
    getUserData();
    setIsProgressRound(
      !moment().isBetween(
        STAKING_POOL_ROUNDS[selectedRound - 1].startedAt,
        STAKING_POOL_ROUNDS[selectedRound - 1].endedAt,
      ),
    );
    getPoolData();
  }, [selectedRound, appState]);

  useEffect(() => {
    setIsCurrentRound(
      moment().isBetween(
        STAKING_POOL_ROUNDS[currentRound - 1].startedAt,
        STAKING_POOL_ROUNDS[currentRound - 1].endedAt,
      ),
    );
  }, [currentRound]);

  useEffect(() => {
    if (isSuccessTx) {
      getUserData();
    }
  }, [isSuccessTx]);

  useEffect(() => {
    if (isCurrentRound && selectedRound === currentRound) {
      setTimeout(() => {
        stakingPoolContract
          .getUserReward(address || '', changedRound)
          .then((res: BigNumber) => {
            setCurrentRoundReward(indicateAmount(res));
          });
        setCount(count + 1);
      }, 5000);
    }
  }, [count, isCurrentRound, selectedRound]);

  return (
    <ScrollView
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
      }}>
      <SheetHeader title="" />
      <View style={{ paddingHorizontal: 20 }}>
        <TitleText
          label={t('main.staking_by_crypto', {
            stakingCrypto: cryptoType,
            rewardCrypto: rewardCryptoType,
          })}
          style={{ fontSize: 22 }}
        />
        <DotGraph
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
          currentRound={currentRound}
        />
        <BoxWithDivider style={{ marginTop: -10 }}>
          <BoxWithDividerContent
            isFirst={true}
            label={t('staking.schedule')}
            value={`${STAKING_POOL_ROUNDS[selectedRound - 1].startedAt.format(
              t('datetime_format'),
            )}\n~ ${STAKING_POOL_ROUNDS[selectedRound - 1].endedAt.format(
              t('datetime_format'),
            )} (KST)`}
            style={{
              paddingVertical: 25,
              paddingHorizontal: 19,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              borderTopColor: AppColors.SUB_GREY,
              borderTopWidth: 1,
              paddingVertical: 25,
              paddingHorizontal: 19,
            }}>
            <StakingInfoCard
              roundEnded={!(isCurrentRound && selectedRound === currentRound)}
              label={t('staking.nth_apr', { round: selectedRound })}
              value={aprFormatter(calculateAPR(cryptoType, totalPrincipal))}
              unit="%"
            />
            <StakingInfoCard
              roundEnded={!(isCurrentRound && selectedRound === currentRound)}
              label={t('staking.nth_principal', { round: selectedRound })}
              value={userPrincipal}
              unit={cryptoType}
              style={{ marginTop: 15 }}
            />
            <StakingInfoCard
              roundEnded={!(isCurrentRound && selectedRound === currentRound)}
              label={t('staking.nth_reward', { round: selectedRound })}
              value={
                selectedRound === currentRound ? currentRoundReward : userReward
              }
              unit={rewardCryptoType}
              style={{ marginTop: 15 }}
              isReward={true}
            />
          </View>
        </BoxWithDivider>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 12,
            marginBottom: 24,
          }}>
          <CircularButtonWithLabel
            icon="+"
            disabled={isProgressRound} // 현재 '진행 중'인 라운드가 있는지 알아야 함...
            label={t('staking.stake')}
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Stake,
                params: {
                  cryptoType,
                  selectedRound,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="-"
            disabled={userPrincipal === '-'}
            label={t('staking.unstake')}
            pressHandler={() => {
              let screen;
              if (cryptoType === CryptoType.EL) {
                if (
                  isCurrentRound &&
                  ((currentRound === 2 && selectedRound === 1) ||
                    (currentRound === 4 && selectedRound === 3))
                ) {
                  screen = StakingPage.UnstakeAndMigrate;
                } else {
                  screen = StakingPage.Unstake;
                }
              } else if (cryptoType === CryptoType.ELFI) {
                if (selectedRound < currentRound && isCurrentRound) {
                  screen = StakingPage.UnstakeAndMigrate;
                } else {
                  screen = StakingPage.Unstake;
                }
              }
              navigation.navigate(Page.Staking, {
                screen,
                params: {
                  cryptoType,
                  selectedRound,
                  currentRound,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="⤴"
            disabled={
              selectedRound === currentRound
                ? currentRoundReward === '-'
                : userReward === '-'
            }
            label={t('staking.claim_rewards')}
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Reward,
                params: {
                  cryptoType,
                  rewardCryptoType,
                  selectedRound,
                },
              });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default TotalDashboard;
