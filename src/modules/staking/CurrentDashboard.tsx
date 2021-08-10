import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
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

  let nextButtonTitle;
  let nextButtonDisabled;
  if (!(isWalletUser || user.ethAddresses[0])) {
    nextButtonTitle = '지갑 연결 필요';
    nextButtonDisabled = true;
  } else if (
    !currentRound ||
    moment().isBetween(
      STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].endedAt,
      STAKING_POOL_ROUNDS_MOMENT[currentRound].startedAt,
    )
  ) {
    nextButtonTitle = 'COMMING SOON!';
    nextButtonDisabled = true;
  } else if (moment().isAfter(STAKING_POOL_ROUNDS_MOMENT[5].endedAt)) {
    nextButtonTitle = '스테이킹 기간 종료';
    nextButtonDisabled = true;
  } else {
    nextButtonTitle = `${currentRound}차 스테이킹`;
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
            label={`보상으로 ${rewardCryptoType} 수령하는`}
            style={{ fontSize: 14 }}
          />
          <TitleText
            label={`${cryptoType} 스테이킹`}
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
              label="기간"
              value={`${STAKING_POOL_ROUNDS[currentRound - 1].startedAt}\n~ ${
                STAKING_POOL_ROUNDS[currentRound - 1].endedAt
              } (KST)`}
            />
            <BoxWithDividerContent
              label="현재 진행 회차"
              value={`${currentRound}차`}
            />
            <BoxWithDividerContent
              label="스테이킹 일수"
              value={`${ROUND_DURATION}일`}
            />
            <BoxWithDividerContent
              label="예상 수익률 (APR)"
              value={`${aprFormatter(calculateAPR(cryptoType, currentRound))}%`}
            />
          </BoxWithDivider>
          <TitleText
            label={`${rewardCryptoType} 채굴 플랜`}
            style={{ fontSize: 22 }}
          />
          <BarGraph currentRound={currentRound} cryptoType={cryptoType} />
          <BoxWithDivider style={{ marginBottom: 27 }}>
            <BoxWithDividerContent
              isFirst={true}
              label="현 채굴량"
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
              label="총 채굴량"
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
