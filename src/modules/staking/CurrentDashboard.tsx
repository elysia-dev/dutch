import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SheetHeader from '../../shared/components/SheetHeader';
import AppColors from '../../enums/AppColors';
import NextButton from '../../shared/components/NextButton';
import { Page, StakingPage } from '../../enums/pageEnum';
import { TitleText, SubTitleText } from '../../shared/components/Texts';
import DotGraph from './components/DotGraph';
import BoxWithDivider from './components/BoxWithDivider';

const DashBoard: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const { type } = route.params;
  const navigation = useNavigation();

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
            label="보상으로 ELFI 수령하는"
            style={{ fontSize: 14 }}
          />
          <TitleText label={`${type} 스테이킹`} style={{ fontSize: 22 }} />
          <DotGraph current={1} />
          <BoxWithDivider
            contents={[
              {
                label: '기간',
                value: '2021.07.25 19:00:00\n~ 2021.09.25 19:00:00 (KST)',
              },
              { label: '현재 진행 회차', value: '1차' },
              { label: '스테이킹 일수', value: '20일' },
              { label: '예상 수익률 (APR)', value: '98.10%' },
            ]}
          />
          <TitleText label="ELFI 채굴 플랜" style={{ fontSize: 22 }} />
          <BoxWithDivider
            contents={[
              { label: '현 채굴량', value: '4,000 ELFI' },
              { label: '총 채굴량', value: '3,000,000 ELFI' },
            ]}
            innerBoxStyle={{ paddingVertical: 16 }}
          />
        </View>
      </ScrollView>
      <NextButton
        title="1차 스테이킹"
        handler={() => {
          navigation.navigate(Page.Staking, {
            screen: StakingPage.Stake,
            params: { type },
          });
        }}
        style={{
          marginBottom: 20,
          marginHorizontal: 16,
        }}
      />
    </View>
  );
};

export default DashBoard;
