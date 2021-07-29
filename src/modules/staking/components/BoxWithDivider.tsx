import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const BoxWithDivider: React.FC<{
  // string 아니면 react component로 받도록 하자
  contents: { label: string; value: string }[];
  boxStyle?: StyleProp<ViewStyle>;
  innerBoxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}> = ({ contents, boxStyle, innerBoxStyle, labelStyle, valueStyle }) => {
  return (
    <View
      style={{
        borderColor: AppColors.SUB_GREY,
        borderRadius: 5,
        borderWidth: 1,
        ...(boxStyle as {}),
      }}>
      {contents.map((content, i) => {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 24,
              paddingHorizontal: 16,
              borderTopColor: AppColors.SUB_GREY,
              borderTopWidth: i === 0 ? 0 : 1,
              ...(innerBoxStyle as {}),
            }}>
            <Text
              style={{
                color: AppColors.SUB_BLACK,
                fontFamily: AppFonts.Regular,
                fontSize: 14,
                ...(labelStyle as {}),
              }}>
              {content.label}
            </Text>
            <Text
              style={{
                color: AppColors.BLACK,
                fontFamily: AppFonts.Regular,
                fontSize: 14,
                textAlign: 'right',
                ...(valueStyle as {}),
              }}>
              {content.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default BoxWithDivider;
