import React from 'react';
import { View, Text } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';
import { H4Text } from '../../../shared/components/Texts';
import BoxWithDivider from './BoxWithDivider';

const MiningPlan: React.FC<{}> = () => {
  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        shadowColor: AppColors.SHADOW_BLACK,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 6,
        elevation: 6,
      }}>
      <H4Text label="1차 채굴 플랜" style={{ textAlign: 'center' }} />
      <BoxWithDivider
        contents={[
          {
            label: '기간',
            value: '2021.07.25 19:00:00\n~ 2021.09.25 19:00:00 (KST)',
          },
          { label: '1차 총 채굴량', value: '5,000,000 ELFI' },
          { label: '1일 채굴량', value: '25,000 ELFI' },
          { label: '누적 채굴량', value: '300,000 ELFI' },
          { label: '잔여 채굴량', value: '4,700,000 ELFI' },
          { label: 'ELFI 가격', value: '$ 5,000' },
        ]}
        innerBoxStyle={{
          paddingVertical: 12,
          paddingHorizontal: 15,
        }}
        labelStyle={{ fontSize: 12 }}
        valueStyle={{ fontSize: 12, fontFamily: AppFonts.Medium }}
      />
    </View>
  );
};

export default MiningPlan;
