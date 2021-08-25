import React, { useState, useEffect, useContext } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SheetHeader from '../../shared/components/SheetHeader';
import AppColors from '../../enums/AppColors';
import NextButton from '../../shared/components/NextButton';
import { Page, StakingPage } from '../../enums/pageEnum';
import { TitleText, SubTitleText, P3Text } from '../../shared/components/Texts';
import DotGraph from './components/DotGraph';
import BarGraph from './components/BarGraph';
import BoxWithDivider from './components/BoxWithDivider';
import MiningPlan from './components/MiningPlan';
import UserContext from '../../contexts/UserContext';
import CryptoType from '../../enums/CryptoType';
import {
  ROUND_DURATION,
  TOTAL_AMOUNT_OF_ELFI_ON_EL_STAKING_POOL,
  TOTAL_AMOUNT_OF_DAI_ON_ELFI_STAKING_POOL,
  STAKING_POOL_ROUNDS,
  STAKING_POOL_ROUNDS_MOMENT,
} from '../../constants/staking';
import commaFormatter from '../../utiles/commaFormatter';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import calculateMined from '../../utiles/calculateMined';
import decimalFormatter from '../../utiles/decimalFormatter';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import WalletContext from '../../contexts/WalletContext';
import useStakingPool from '../../hooks/useStakingPool';
import { BigNumber, constants } from 'ethers';
import getStakingStatus from '../../utiles/getStakingStatus';
import StakingStatus from '../../enums/StakingStatus';
import { useRef } from 'react';
import StakingDescription from './components/StakingDescription';
import moment from 'moment';

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
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedRound, setSelectedRound] = useState(currentRound);
  const { isWalletUser, user } = useContext(UserContext);
  const { wallet } = useContext(WalletContext);
  const totalAmountOfReward =
    cryptoType === CryptoType.EL
      ? TOTAL_AMOUNT_OF_ELFI_ON_EL_STAKING_POOL
      : TOTAL_AMOUNT_OF_DAI_ON_ELFI_STAKING_POOL;
  const { t } = useTranslation();
  const stakingPoolContract = useStakingPool(cryptoType);
  const [totalPrincipal, setTotalPrincipal] = useState<BigNumber>(
    constants.Zero,
  );
  const stakingStatus = getStakingStatus(currentRound);

  let nextButtonTitle = '';
  if (!(isWalletUser || user.ethAddresses[0])) {
    nextButtonTitle = t('staking.need_wallet');
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
    const poolData = await stakingPoolContract.getPoolData(currentRound);
    setTotalPrincipal(poolData[4]);
  };

  useEffect(() => {
    stakingPoolContract?.currentRound().then((res: any) => {
      setCurrentRound(res);
    });
    let isBetween = false;
    if (currentRound !== 6) {
      isBetween = moment().isBetween(
        STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].endedAt,
        STAKING_POOL_ROUNDS_MOMENT[currentRound].startedAt,
      );
    }
    getPoolData();
    miningPlanRef.current?.scrollTo({
      x: 336 * (isBetween ? currentRound : currentRound === 0 ? 1 : -1),
    });
  }, [currentRound]);

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
          <SubTitleText
            label={t('staking.staking_with_type_subtitle', {
              rewardCrypto: rewardCryptoType,
            })}
            style={{ fontSize: 14 }}
          />
          <TitleText
            label={t('staking.staking_with_type', {
              stakingCrypto: cryptoType,
            })}
            style={{ fontSize: 22 }}
          />
          <DotGraph
            selectedRound={selectedRound}
            setSelectedRound={setSelectedRound}
          />
          <BoxWithDivider style={{ marginBottom: 55 }}>
            <BoxWithDividerContent
              isFirst={true}
              label={t('staking.schedule')}
              value={`${STAKING_POOL_ROUNDS[currentRound - 1].startedAt}\n~ ${
                STAKING_POOL_ROUNDS[currentRound - 1].endedAt
              } (KST)`}
            />
            <BoxWithDividerContent
              label={t('staking.current_round')}
              value={`${currentRound}차`}
            />
            <BoxWithDividerContent
              label={t('staking.staking_days')}
              value={`${ROUND_DURATION}일`}
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
                  [1, 2, 3, 4, 5, 6].reduce(
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
            {[1, 2, 3, 4, 5, 6].map((i) => {
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
        disabled={stakingStatus !== StakingStatus.ROUND_IN_PROGRESS}
        style={{
          marginBottom: 20,
          marginHorizontal: 16,
        }}
      />
    </View>
  );
};

export default CurrentDashboard;
