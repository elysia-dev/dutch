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
  const currentCycle = 3; // dummy data
  const [selectedCycle, setSelectedCycle] = useState(currentCycle);

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
          selectedCycle={selectedCycle}
          setSelectedCycle={setSelectedCycle}
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
                    cycleEnded={false}
                    label={`${selectedCycle}차 스테이킹 APR`}
                    value="130,000"
                    unit="EL"
                  />
                  <StakingInfoCard
                    cycleEnded={false}
                    label={`${selectedCycle}차 스테이킹 수량`}
                    value="4.07"
                    unit="%"
                    style={{ marginTop: 15 }}
                  />
                  <StakingInfoCard
                    cycleEnded={false}
                    label={`${selectedCycle}차 보상 수량`}
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
            isActive={currentCycle && currentCycle === selectedCycle}
            selectedCycle={selectedCycle}
            currentCycle={currentCycle}
          />
          <CircularButtonWithLabel
            cryptoType={cryptoType}
            actionType="unstaking"
            isActive={currentCycle && currentCycle >= selectedCycle}
            selectedCycle={selectedCycle}
            currentCycle={currentCycle}
            isRewardAvailable={currentCycle > selectedCycle} // 현재회차가없으면끝났다는표시라도받아야하고, 받을보상이있는지 확인필요
            isMigrationAvailable={Boolean(currentCycle)}
          />
          <CircularButtonWithLabel
            cryptoType={cryptoType}
            actionType="reward"
            selectedCycle={selectedCycle}
            currentCycle={currentCycle}
            isActive={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default TotalDashboard;
