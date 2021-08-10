import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from '../../shared/components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../utiles/getContract';
import CryptoType from '../../enums/CryptoType';
import calculateAPR, { aprFormatter } from '../../utiles/calculateAPR';
import { STAKING_POOL_ROUNDS } from '../../constants/staking';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import { Page, StakingPage } from '../../enums/pageEnum';

const TotalDashboard: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType, round, stakingAmount, rewardAmount } = route.params;
  const rewardCryptoType =
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI;
  const [selectedRound, setSelectedRound] = useState(round);
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
  const [currentRound, setCurrentRound] = useState(0);
  contract?.currentRound().then((res: any) => {
    setCurrentRound(res);
  });
  const navigation = useNavigation();
  const isRewardAvailable = currentRound > selectedRound; // 현재회차가없으면끝났다는표시라도받아야하고, 받을보상이있는지 확인필요
  const isMigrationAvailable = Boolean(currentRound);

  useEffect(() => {
    contract?.getPoolData(selectedRound).then((res: any) => {
      setPoolData({
        rewardPerSecond: res[0],
        rewardIndex: res[1],
        startTimestamp: res[2],
        endTimestamp: res[3],
        totalPrincipal: res[4],
        lastUpdateTimestamp: res[5],
      });
    });
  }, [selectedRound]);

  return (
    <ScrollView
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
      }}>
      <SheetHeader title="" />
      <View style={{ paddingHorizontal: 20 }}>
        <TitleText
          label={`${cryptoType} 스테이킹 및 ${rewardCryptoType} 리워드`}
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
            label="기간"
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
              label={`${selectedRound}차 스테이킹 APR`}
              value={aprFormatter(calculateAPR(cryptoType, selectedRound))}
              unit="EL"
            />
            <StakingInfoCard
              roundEnded={false}
              label={`${selectedRound}차 스테이킹 수량`}
              value={stakingAmount || '-'}
              unit={cryptoType}
              style={{ marginTop: 15 }}
            />
            <StakingInfoCard
              roundEnded={false}
              label={`${selectedRound}차 보상 수량`}
              value={rewardAmount || '-'}
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
            disabled={!(currentRound && currentRound === selectedRound)}
            label="스테이킹"
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Stake,
                params: {
                  cryptoType,
                  selectedRound,
                  currentRound,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="-"
            disabled={!(currentRound && currentRound >= selectedRound)}
            label="언스테이킹"
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: isRewardAvailable
                  ? StakingPage.SelectUnstakingType
                  : StakingPage.Unstake,
                params: {
                  cryptoType,
                  selectedRound,
                  currentRound,
                  pageAfterSelection: isMigrationAvailable
                    ? StakingPage.UnstakeAndMigrate
                    : StakingPage.Unstake,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="⤴"
            disabled={!isRewardAvailable}
            label="보상 수령"
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Reward,
                params: {
                  cryptoType,
                  selectedRound,
                  currentRound,
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
