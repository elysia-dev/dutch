import React from 'react';
import { View } from 'react-native';
import AppColors from '../../enums/AppColors';
import SheetHeader from '../../shared/components/SheetHeader';
import { TitleText } from '../../shared/components/Texts';
import BoxWithDivider from './components/BoxWithDivider';
import DotGraph from './components/DotGraph';
import CircularButtonWithLabel from './components/CircularButtonWithLabel';
import StakingInfoCard from './components/StakingInfoCard';

const TotalDashboard: React.FC<{ route: any }> = ({ route }) => {
  const { type } = route.params;

  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        height: '100%',
        width: '100%',
      }}>
      <SheetHeader title="" />
      <View style={{ paddingHorizontal: 20 }}>
        <TitleText
          label="EL 스테이킹 및 ELFI 리워드"
          style={{ fontSize: 22 }}
        />
        <DotGraph />
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
                    label="1차 스테이킹 APR"
                    value="130,000"
                    unit="EL"
                  />
                  <StakingInfoCard
                    label="1차 스테이킹 수량"
                    value="4.07"
                    unit="%"
                    style={{ marginTop: 15 }}
                  />
                  <StakingInfoCard
                    label="1차 보상 수량"
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <CircularButtonWithLabel
            cryptoType={type}
            actionType="staking"
            isActive={true}
          />
          <CircularButtonWithLabel
            cryptoType={type}
            actionType="unstaking"
            isActive={true}
          />
          <CircularButtonWithLabel
            cryptoType={type}
            actionType="reward"
            isActive={true}
          />
        </View>
      </View>
    </View>
  );
};

export default TotalDashboard;
