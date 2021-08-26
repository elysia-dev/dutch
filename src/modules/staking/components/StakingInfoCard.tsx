import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import CardWithShadow from './CardWithShadow';
import { H4Text, SubTitleText } from '../../../shared/components/Texts';
import AppFonts from '../../../enums/AppFonts';
import AppColors from '../../../enums/AppColors';

const StakingInfoCard: React.FC<{
  roundEnded: boolean;
  label: string;
  value: string;
  unit: string;
  style?: StyleProp<ViewStyle>;
}> = ({ roundEnded, label, value, unit, style }) => {
  return (
    <CardWithShadow
      style={{
        shadowOpacity: roundEnded ? 0 : 1,
        elevation: roundEnded ? 0 : 6,
        borderColor: AppColors.SUB_GREY,
        borderWidth: roundEnded ? 1 : 0,
        backgroundColor: roundEnded ? '#F8F8F8' : AppColors.WHITE,
        ...(style as {}),
      }}>
      <H4Text label={label} style={{ padding: 15 }} />
      <View
        style={{
          flexDirection: 'row',
          padding: roundEnded ? 14 : 15,
          justifyContent: 'flex-end',
          borderTopColor: AppColors.SUB_GREY,
          borderTopWidth: 1,
        }}>
        <H4Text
          label={value}
          style={{
            fontSize: 18,
            color:
              label.includes('보상') && !roundEnded
                ? '#00BFFF'
                : AppColors.BLACK,
          }}
        />
        <SubTitleText
          label={` ${unit}`}
          style={{
            fontSize: 14,
            fontFamily: AppFonts.Bold,
            marginTop: 2,
          }}
        />
      </View>
    </CardWithShadow>
  );
};

export default StakingInfoCard;
