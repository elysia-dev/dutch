import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import SheetHeader from '../../shared/components/SheetHeader';
import AppColors from '../../enums/AppColors';
import NextButton from '../../shared/components/NextButton';
import { Page, StakingPage } from '../../enums/pageEnum';
import { TitleText, SubTitleText } from '../../shared/components/Texts';
import DotGraph from './components/DotGraph';
import BarGraph from './components/BarGraph';
import BoxWithDivider from './components/BoxWithDivider';
import MiningPlan from './components/MiningPlan';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../utiles/getContract';
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

const DashBoard: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const { cryptoType, rewardCryptoType } = route.params;
  const navigation = useNavigation();
  const contract =
    cryptoType === CryptoType.EL
      ? getElStakingPoolContract()
      : getElfiStakingPoolContract();
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedRound, setSelectedRound] = useState(currentRound);
  const { isWalletUser, user } = useContext(UserContext);
  const totalAmountOfReward =
    cryptoType === CryptoType.EL
      ? TOTAL_AMOUNT_OF_ELFI_ON_EL_STAKING_POOL
      : TOTAL_AMOUNT_OF_DAI_ON_ELFI_STAKING_POOL;
  const { t } = useTranslation();

  let nextButtonTitle;
  let nextButtonDisabled;
  if (!(isWalletUser || user.ethAddresses[0])) {
    nextButtonTitle = t('staking.need_wallet');
    nextButtonDisabled = true;
  } else if (
    !currentRound ||
    (currentRound !== 6 &&
      moment().isBetween(
        STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].endedAt,
        STAKING_POOL_ROUNDS_MOMENT[currentRound].startedAt,
      ))
  ) {
    nextButtonTitle = t('staking.comming_soon');
    nextButtonDisabled = true;
  } else if (moment().isAfter(STAKING_POOL_ROUNDS_MOMENT[5].endedAt)) {
    nextButtonTitle = t('staking.staking_ended');
    nextButtonDisabled = true;
  } else {
    nextButtonTitle = t('staking.nth_staking', { round: currentRound });
    nextButtonDisabled = false;
  }

  useEffect(() => {
    contract?.currentRound().then((res: any) => {
      setCurrentRound(res);
    });
  }, []);

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
            currentRound={currentRound}
            selectedRound={selectedRound}
            setSelectedRound={setSelectedRound}
          />
          <BoxWithDivider style={{ marginBottom: 60 }}>
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
              value={`${aprFormatter(calculateAPR(cryptoType, currentRound))}%`}
            />
          </BoxWithDivider>
          <TitleText
            label={t('staking.mining_plan', { rewardCrypto: rewardCryptoType })}
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
          <ScrollView horizontal={true} style={{ marginBottom: 100 }}>
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
        disabled={nextButtonDisabled}
        style={{
          marginBottom: 20,
          marginHorizontal: 16,
        }}
      />
    </View>
  );
};

export default DashBoard;
