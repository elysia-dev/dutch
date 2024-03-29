import React, { useState, useEffect, useContext, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { BigNumber, constants } from 'ethers';
import SheetHeader from '../../shared/components/SheetHeader';
import AppColors from '../../enums/AppColors';
import NextButton from '../../shared/components/NextButton';
import { Page, StakingPage } from '../../enums/pageEnum';
import {
  TitleText,
  SubTitleText,
  H1Text,
  H2Text,
} from '../../shared/components/Texts';
import DotGraph from './components/DotGraph';
import BarGraph from './components/BarGraph';
import BoxWithDivider from './components/BoxWithDivider';
import MiningPlan from './components/MiningPlan';
import UserContext from '../../contexts/UserContext';
import CryptoType from '../../enums/CryptoType';
import {
  ROUND_DURATIONS,
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
  STAKING_POOL_ROUNDS,
  NUMBER_OF_ROUNDS,
} from '../../constants/staking';
import commaFormatter from '../../utiles/commaFormatter';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import calculateMined from '../../utiles/calculateMined';
import decimalFormatter from '../../utiles/decimalFormatter';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import useStakingPool from '../../hooks/useStakingPool';
import getStakingStatus from '../../utiles/getStakingStatus';
import StakingStatus from '../../enums/StakingStatus';
import StakingDescription from './components/StakingDescription';
import useAppState from '../../hooks/useAppState';
import getCurrentStakingRound, {
  isElfiV2,
} from '../../utiles/getCurrentStakingRound';
import range from '../../utiles/range';
import useUserAddress from '../../hooks/useUserAddress';

type ParamList = {
  CurrentDashboard: {
    cryptoType: CryptoType;
    rewardCryptoType: CryptoType;
  };
};

const CurrentDashboard: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'CurrentDashboard'>>();
  const { cryptoType, rewardCryptoType } = route.params;
  const miningPlanRef = useRef<ScrollView | null>();
  const navigation = useNavigation();
  const [currentRound, setCurrentRound] = useState(getCurrentStakingRound());
  const { isWalletUser, user } = useContext(UserContext);
  const totalAmountOfReward = ROUND_DURATIONS.reduce((res, cur) => {
    const rewardPerDay =
      cryptoType === CryptoType.EL
        ? ELFI_PER_DAY_ON_EL_STAKING_POOL
        : DAI_PER_DAY_ON_ELFI_STAKING_POOL;
    return res + rewardPerDay * cur;
  }, 0);
  const { t } = useTranslation();
  const isElfiV2Con = isElfiV2(cryptoType, currentRound);
  const stakingPoolContract = useStakingPool(cryptoType, isElfiV2Con);
  const [totalPrincipal, setTotalPrincipal] = useState<BigNumber>(
    constants.Zero,
  );
  const stakingStatus = getStakingStatus(currentRound);
  const appState = useAppState();
  const hasWallet = useUserAddress();
  const stakingRounds = range(1, NUMBER_OF_ROUNDS, 1);
  const changedRound = // 변경된 컨트랙트 현재라운드에서 2를 빼줘야함 (변수이름 변경해주고 리팩토링)
    cryptoType === CryptoType.EL || currentRound <= 2
      ? currentRound
      : currentRound - 2;
  let nextButtonTitle = '';
  if (!hasWallet) {
    nextButtonTitle = t('staking.need_wallet'); //
  } else {
    switch (stakingStatus) {
      case StakingStatus.NOT_YET_STARTED:
      case StakingStatus.ROUND_NOT_IN_PROGRESS:
        nextButtonTitle = t('staking.coming_soon');
        break;
      case StakingStatus.ROUND_IN_PROGRESS:
        nextButtonTitle = t('staking.nth_staking', { round: currentRound });
        break;
      case StakingStatus.ENDED:
        nextButtonTitle = t('staking.staking_ended');
        break;
      default:
        break;
    }
  }

  const getPoolData = async () => {
    const poolData = await stakingPoolContract.getPoolData(changedRound);
    setTotalPrincipal(poolData[4]);
  };

  useEffect(() => {
    setCurrentRound(getCurrentStakingRound());
    let isBetween = false;
    if (currentRound < NUMBER_OF_ROUNDS && currentRound > 0) {
      isBetween = moment().isBetween(
        STAKING_POOL_ROUNDS[currentRound - 1].endedAt,
        STAKING_POOL_ROUNDS[currentRound].startedAt,
      );
    }
    getPoolData();
    miningPlanRef.current?.scrollTo({
      x:
        310 *
        (isBetween ? currentRound : currentRound === 0 ? 0 : currentRound - 1),
    });
  }, [currentRound, appState]);

  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
        width: '100%',
      }}>
      <ScrollView
        style={{
          backgroundColor: AppColors.WHITE,
          height: '100%',
        }}>
        <SheetHeader title="" />
        <View style={{ paddingHorizontal: 20 }}>
          <TitleText
            label={t('staking.staking_with_type', {
              stakingCrypto: cryptoType,
            })}
            style={{ fontSize: 22 }}
          />
          <DotGraph selectedRound={currentRound} currentRound={currentRound} />
          {stakingStatus === StakingStatus.ENDED ? (
            <BoxWithDivider
              style={{
                borderColor: AppColors.GREY,
                paddingVertical: 14,
                paddingHorizontal: 17,
              }}>
              <SubTitleText
                label={t('staking.total_mining_supply_with_reward_type', {
                  rewardCrypto: rewardCryptoType,
                })}
                style={{ fontSize: 14 }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 16,
                  marginBottom: 23,
                }}>
                <H1Text
                  label={commaFormatter(totalAmountOfReward)}
                  style={{ fontSize: 30, marginRight: 6 }}
                />
                <H2Text
                  label={rewardCryptoType}
                  style={{ color: AppColors.BLACK2, marginTop: 4.5 }}
                />
              </View>
            </BoxWithDivider>
          ) : (
            <>
              <BoxWithDivider style={{ marginBottom: 60 }}>
                <BoxWithDividerContent
                  isFirst={true}
                  label={t('staking.schedule')}
                  value={`${STAKING_POOL_ROUNDS[
                    currentRound - 1
                  ].startedAt.format(
                    t('datetime_format'),
                  )}\n~ ${STAKING_POOL_ROUNDS[currentRound - 1].endedAt.format(
                    t('datetime_format'),
                  )} (KST)`}
                />
                <BoxWithDividerContent
                  label={t('staking.current_round')}
                  value={t('staking.round_with_affix', { round: currentRound })}
                />
                <BoxWithDividerContent
                  label={t('staking.staking_days')}
                  value={t('staking.duration_day', {
                    duration: ROUND_DURATIONS[currentRound - 1],
                  })}
                />
                <BoxWithDividerContent
                  label={t('staking.apr')}
                  value={`${aprFormatter(
                    calculateAPR(cryptoType, totalPrincipal),
                  )}%`}
                />
              </BoxWithDivider>
              <StakingDescription
                stakingCrypto={cryptoType}
                rewardCrypto={rewardCryptoType}
              />
              <TitleText
                label={t('staking.mining_plan', {
                  rewardCrypto: rewardCryptoType,
                })}
                style={{ fontSize: 22 }}
              />
              <BarGraph currentRound={currentRound} cryptoType={cryptoType} />
              <BoxWithDivider style={{ marginBottom: 27 }}>
                <BoxWithDividerContent
                  isFirst={true}
                  label={t('staking.current_mined')}
                  value={`${commaFormatter(
                    decimalFormatter(
                      stakingRounds.reduce(
                        (totalMined, round) =>
                          totalMined +
                          calculateMined(cryptoType, round, currentRound),
                        0,
                      ),
                      5,
                    ),
                  )} ${rewardCryptoType}`}
                  style={{ paddingVertical: 16 }}
                />
                <BoxWithDividerContent
                  label={t('staking.total_mining_supply')}
                  value={`${commaFormatter(
                    totalAmountOfReward,
                  )} ${rewardCryptoType}`}
                  style={{ paddingVertical: 16 }}
                />
              </BoxWithDivider>
              <ScrollView
                ref={(ref) => {
                  miningPlanRef.current = ref;
                }}
                horizontal={true}
                style={{ marginBottom: 100 }}>
                {stakingRounds.map((i) => {
                  return (
                    <MiningPlan
                      key={i}
                      round={i}
                      cryptoType={cryptoType}
                      currentRound={currentRound}
                    />
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
      <NextButton
        title={nextButtonTitle}
        handler={() => {
          navigation.navigate(Page.Staking, {
            screen: StakingPage.Stake,
            params: { cryptoType, selectedRound: currentRound },
          });
        }}
        disabled={
          !hasWallet || stakingStatus !== StakingStatus.ROUND_IN_PROGRESS
        }
        style={{
          marginBottom: 20,
          marginHorizontal: 16,
        }}
      />
    </View>
  );
};

export default CurrentDashboard;
