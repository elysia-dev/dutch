import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from '../../shared/components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';
import BoxWithDividerContent from './components/BoxWithDividerContent';
import { Page, StakingPage } from '../../enums/pageEnum';

const TotalDashboard: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType } = route.params;
  const currentCycle = 3; // dummy data
  const [selectedCycle, setSelectedCycle] = useState(currentCycle);
  const navigation = useNavigation();
  const isRewardAvailable = currentCycle > selectedCycle; // 현재회차가없으면끝났다는표시라도받아야하고, 받을보상이있는지 확인필요
  const isMigrationAvailable = Boolean(currentCycle);

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
        <BoxWithDivider style={{ marginTop: -10 }}>
          <BoxWithDividerContent
            isFirst={true}
            label="기간"
            value={`2021.07.25 19:00:00\n~ 2021.09.25 19:00:00 (KST)`}
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
            disabled={!(currentCycle && currentCycle === selectedCycle)}
            label="스테이킹"
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: StakingPage.Stake,
                params: {
                  cryptoType,
                  selectedCycle,
                  currentCycle,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="-"
            disabled={!(currentCycle && currentCycle >= selectedCycle)}
            label="언스테이킹"
            pressHandler={() => {
              navigation.navigate(Page.Staking, {
                screen: isRewardAvailable
                  ? StakingPage.SelectUnstakingType
                  : StakingPage.Unstake,
                params: {
                  cryptoType,
                  selectedCycle,
                  currentCycle,
                  pageAfterSelection: isMigrationAvailable
                    ? StakingPage.UnstakeAndMigrate
                    : StakingPage.Unstake,
                },
              });
            }}
          />
          <CircularButtonWithLabel
            icon="⤴"
            disabled={false}
            label="보상 수령"
            pressHandler={() => {
              console.log('아직 보상 수령 페이지가 없음');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default TotalDashboard;
