import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const BoxWithDividerContent: React.FC<{
  isFirst?: boolean;
  label: string;
  value: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}> = ({ isFirst, label, value, style, labelStyle, valueStyle }) => {
  return (
    <View
      key={String(label)}
      style={{
        backgroundColor: AppColors.WHITE,
        flexDirection: 'row',
        justifyContent: label && value ? 'space-between' : 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderTopColor: AppColors.SUB_GREY,
        borderTopWidth: isFirst ? 0 : 1,
        ...(style as {}),
      }}>
      <Text
        style={{
          color: AppColors.SUB_BLACK,
          fontFamily: AppFonts.Regular,
          fontSize: 14,
          ...(labelStyle as {}),
        }}>
        {label}
      </Text>
      <Text
        style={{
          color: AppColors.BLACK,
          fontFamily: AppFonts.Medium,
          fontSize: 14,
          textAlign: 'right',
          ...(valueStyle as {}),
        }}>
        {value}
      </Text>
    </View>
  );
};

export default BoxWithDividerContent;
