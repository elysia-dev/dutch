import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from './components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from '../../utiles/getContract';
import CryptoType from '../../enums/CryptoType';
import calcAPR from '../../utiles/calculateAPR';

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
  let currentRound = 0;
  contract?.currentRound().then((res: any) => {
    currentRound = res;
  });

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
        />
        <BoxWithDivider
          contents={[
            {
              label: '기간',
              value: `${poolData.startTimestamp}\n~ ${poolData.endTimestamp} (KST)`,
            },
            {
              label: (
                <>
                  <StakingInfoCard
                    roundEnded={false}
                    label={`${selectedRound}차 스테이킹 APR`}
                    value={calcAPR(cryptoType, selectedRound).toString()}
                    unit="%"
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
                </>
              ),
              value: '',
            },
          ]}
          boxStyle={{ marginTop: -10 }}
          innerBoxStyle={{ paddingVertical: 25, paddingHorizontal: 19 }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 12,
            marginBottom: 24,
          }}>
          <CircularButtonWithLabel
            cryptoType={cryptoType}
            actionType="staking"
            isActive={Boolean(currentRound) && currentRound === selectedRound}
            selectedRound={selectedRound}
            currentRound={currentRound}
          />
          <CircularButtonWithLabel
            cryptoType={cryptoType}
            actionType="unstaking"
            isActive={Boolean(currentRound) && currentRound >= selectedRound}
            selectedRound={selectedRound}
            currentRound={currentRound}
            isRewardAvailable={currentRound > selectedRound} // 현재회차가없으면끝났다는표시라도받아야하고, 받을보상이있는지 확인필요
            isMigrationAvailable={Boolean(currentRound)}
          />
          <CircularButtonWithLabel
            cryptoType={cryptoType}
            actionType="reward"
            selectedRound={selectedRound}
            currentRound={currentRound}
            isActive={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default TotalDashboard;
