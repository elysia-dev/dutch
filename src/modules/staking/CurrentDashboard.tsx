import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  STAKING_POOL_ROUND,
} from '../../constants/staking';
import commaFormatter from '../../utiles/commaFormatter';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';

const DashBoard: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const { cryptoType, rewardCryptoType } = route.params;
  const navigation = useNavigation();
  const [poolData, setPoolData] = useState({
    rewardPerSecond: 0,
    rewardIndex: 0,
    startTimestamp: 0,
    endTimestamp: 0,
    totalPrincipal: 0,
    lastUpdateTimestamp: 0,
  });
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

  // 현재 진행중인 회차가 없고, 진행 예정인 회차가 있을 경우도 생각해야 함!!!!
  // 기간 데이터의 마지막 날짜와 지금 시간을 비교하자

  // let nextButtonTitle;
  // let nextButtonDisabled;
  // if (!(isWalletUser || user.ethAddresses[0])) {
  //   nextButtonTitle = '지갑 연결 필요';
  //   nextButtonDisabled = true;
  // } else if (!currentRound) {
  //   nextButtonTitle = 'COMMING SOON!';
  //   nextButtonDisabled = true;
  // } else if (!currentRound) {
  //   nextButtonTitle = '스테이킹 기간 종료';
  //   nextButtonDisabled = true;
  // } else {
  //   nextButtonTitle = `${currentRound}차 스테이킹`;
  //   nextButtonDisabled = false;
  // }
  const nextButtonTitle = `${currentRound}차 스테이킹`;
  const nextButtonDisabled = false;

  useEffect(() => {
    contract?.currentRound().then((res: any) => {
      setCurrentRound(res);
    });
  }, []);

  useEffect(() => {
    contract?.getPoolData(currentRound).then((res: any) => {
      setPoolData({
        rewardPerSecond: res[0],
        rewardIndex: res[1],
        startTimestamp: res[2],
        endTimestamp: res[3],
        totalPrincipal: res[4],
        lastUpdateTimestamp: res[5],
      });
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
            label={`보상으로 ${rewardCryptoType} 수령하는`}
            style={{ fontSize: 14 }}
          />
          <TitleText
            label={`${cryptoType} 스테이킹`}
            style={{ fontSize: 22 }}
          />
          <DotGraph
            selectedRound={selectedRound}
            setSelectedRound={setSelectedRound}
          />
          <BoxWithDivider
            contents={[
              {
                label: '기간',
                value: `${STAKING_POOL_ROUND[currentRound - 1].startedAt}\n~ ${
                  STAKING_POOL_ROUND[currentRound - 1].endedAt
                } (KST)`,
              },
              { label: '현재 진행 회차', value: `${currentRound}차` },
              { label: '스테이킹 일수', value: `${ROUND_DURATION}일` },
              {
                label: '예상 수익률 (APR)',
                value: `${aprFormatter(
                  calculateAPR(cryptoType, currentRound),
                )}%`,
              },
            ]}
            boxStyle={{ marginBottom: 60 }}
          />
          <TitleText
            label={`${rewardCryptoType} 채굴 플랜`}
            style={{ fontSize: 22 }}
          />
          <BarGraph />
          <BoxWithDivider
            contents={[
              { label: '현 채굴량', value: `${'(모름)'} ${rewardCryptoType}` },
              {
                label: '총 채굴량',
                value: `${commaFormatter(
                  totalAmountOfReward,
                )} ${rewardCryptoType}`,
              },
            ]}
            innerBoxStyle={{ paddingVertical: 16 }}
            boxStyle={{ marginBottom: 27 }}
          />
          <ScrollView horizontal={true} style={{ marginBottom: 100 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => {
              return (
                <MiningPlan
                  key={i}
                  round={i}
                  rewardCryptoType={rewardCryptoType}
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
