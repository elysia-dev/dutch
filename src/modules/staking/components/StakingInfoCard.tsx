import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import CardWithShadow from './CardWithShadow';
import { H4Text, SubTitleText } from '../../../shared/components/Texts';
import AppFonts from '../../../enums/AppFonts';
import AppColors from '../../../enums/AppColors';

const StakingInfoCard: React.FC<{
  label: string;
  value: string;
  unit: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, value, unit, style }) => {
  return (
    <CardWithShadow style={{ borderRadius: 5, ...(style as {}) }}>
      <H4Text label={label} style={{ padding: 15 }} />
      <View
        style={{
          flexDirection: 'row',
          padding: 15,
          justifyContent: 'flex-end',
          borderTopColor: AppColors.SUB_GREY,
          borderTopWidth: 1,
        }}>
        <H4Text
          label={value}
          style={{
            fontSize: 18,
            color: label === '1차 보상 수량' ? '#00BFFF' : AppColors.BLACK,
          }}
        />
        <SubTitleText
          label={` ${unit}`}
          style={{
            fontSize: 14,
            fontFamily: AppFonts.Bold,
          }}
        />
      </View>
    </CardWithShadow>
  );
};

export default StakingInfoCard;
