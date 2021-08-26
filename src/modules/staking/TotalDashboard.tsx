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
import {
  STAKING_POOL_ROUNDS,
  STAKING_POOL_ROUNDS_MOMENT,
} from '../../constants/staking';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import { Page, StakingPage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import decimalFormatter from '../../utiles/decimalFormatter';
import commaFormatter from '../../utiles/commaFormatter';
import useStakingPool from '../../hooks/useStakingPool';

type ParamList = {
  TotalDashboard: {
    cryptoType: CryptoType;
    round: number;
    stakingAmount: BigNumber;
    rewardAmount: BigNumber;
  };
};

const TotalDashboard: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'TotalDashboard'>>();
  const { cryptoType, round, stakingAmount, rewardAmount } = route.params;
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const [selectedRound, setSelectedRound] = useState(round);
  const navigation = useNavigation();
  const [userReward, setUserReward] = useState('-');
  const [userPrincipal, setUserPrincipal] = useState('-');
  const [currentRoundReward, setCurrentRoundReward] = useState('-');
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const address = isWalletUser // 이거 아예 함수로 만들어야겠는데...
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];
  const { t } = useTranslation();
  const stakingPoolContract = useStakingPool(cryptoType);
  const [currentRound, setCurrentRound] = useState(1);
  const [isProgressRound, setIsProgressRound] = useState(false);
  const [isCurrentRound, setIsCurrentRound] = useState(false);
  const [totalPrincipal, setTotalPrincipal] = useState<BigNumber>(
    constants.Zero,
  );
  const [count, setCount] = useState(0);
  stakingPoolContract.currentRound().then((res: any) => {
    setCurrentRound(res);
  });

  const formatAmount = (amount: BigNumber) => {
    return commaFormatter(
      decimalFormatter(Number(utils.formatEther(amount)), 5),
    );
  };

  const indicateAmount = (amount: BigNumber) => {
    return amount.toHexString() !== '0x00' ? formatAmount(amount) : '-';
  };

  const getPoolData = async () => {
    const poolData = await stakingPoolContract.getPoolData(selectedRound);
    setTotalPrincipal(poolData[4]);
  };

  useEffect(() => {
    // if (selectedRound === currentRound) clearTimeout();
    stakingPoolContract
      .getUserData(selectedRound, address || '')
      .then((res: BigNumber[]) => {
        setCurrentRoundReward(indicateAmount(res[1]));
        setUserReward(indicateAmount(res[1]));
        setUserPrincipal(indicateAmount(res[2]));
      })
      .catch((e) => {
        console.log(e);
      });
    setIsProgressRound(
      !moment().isBetween(
        STAKING_POOL_ROUNDS_MOMENT[selectedRound - 1].startedAt,
        STAKING_POOL_ROUNDS_MOMENT[selectedRound - 1].endedAt,
      ),
    );
    getPoolData();
  }, [selectedRound]);

  useEffect(() => {
    setIsCurrentRound(
      moment().isBetween(
        STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].startedAt,
        STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].endedAt,
      ),
    );
  }, [currentRound]);

  useEffect(() => {
    if (isCurrentRound && selectedRound === currentRound) {
      setTimeout(() => {
        stakingPoolContract
          .getUserData(currentRound, address || '')
          .then((res: BigNumber[]) => {
            setCurrentRoundReward(indicateAmount(res[1]));
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
        />
        <BoxWithDivider style={{ marginTop: -10 }}>
          <BoxWithDividerContent
            isFirst={true}
            label={t('staking.schedule')}
            value={`${STAKING_POOL_ROUNDS[selectedRound - 1].startedAt}\n~ ${
              STAKING_POOL_ROUNDS[selectedRound - 1].endedAt
            } (KST)`}
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
              roundEnded={false}
              label={t('staking.nth_apr', { round: selectedRound })}
              value={aprFormatter(calculateAPR(cryptoType, totalPrincipal))}
              unit="%"
            />
            <StakingInfoCard
              roundEnded={false}
              label={t('staking.nth_principal', { round: selectedRound })}
              value={userPrincipal}
              unit={cryptoType}
              style={{ marginTop: 15 }}
            />
            <StakingInfoCard
              roundEnded={false}
              label={t('staking.nth_reward', { round: selectedRound })}
              value={
                selectedRound === currentRound ? currentRoundReward : userReward
              }
              unit={rewardCryptoType}
              style={{ marginTop: 15 }}
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
              navigation.navigate(Page.Staking, {
                screen:
                  selectedRound < currentRound && isCurrentRound
                    ? StakingPage.UnstakeAndMigrate
                    : StakingPage.Unstake,
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
