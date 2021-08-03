import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from './components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';

const TotalDashboard: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType } = route.params;
  const currentRound = 3; // dummy data
  const [selectedRound, setSelectedRound] = useState(currentRound);

  return (
    <ScrollView
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
      }}>
      <SheetHeader title="" />
      <View style={{ paddingHorizontal: 20 }}>
        <TitleText
          label="EL 스테이킹 및 ELFI 리워드"
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
              value: '2021.07.25 19:00:00\n~ 2021.09.25 19:00:00 (KST)',
            },
            {
              label: (
                <>
                  <StakingInfoCard
                    roundEnded={false}
                    label={`${selectedRound}차 스테이킹 APR`}
                    value="130,000"
                    unit="EL"
                  />
                  <StakingInfoCard
                    roundEnded={false}
                    label={`${selectedRound}차 스테이킹 수량`}
                    value="4.07"
                    unit="%"
                    style={{ marginTop: 15 }}
                  />
                  <StakingInfoCard
                    roundEnded={false}
                    label={`${selectedRound}차 보상 수량`}
                    value="130,000"
                    unit="ELFI"
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
            isActive={currentRound && currentRound === selectedRound}
            selectedRound={selectedRound}
            currentRound={currentRound}
          />
          <CircularButtonWithLabel
            cryptoType={cryptoType}
            actionType="unstaking"
            isActive={currentRound && currentRound >= selectedRound}
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
