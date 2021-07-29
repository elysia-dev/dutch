import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const BoxWithDivider: React.FC<{
  contents: {
    label: string | React.ReactNode;
    value: string | React.ReactNode;
  }[];
  boxStyle?: StyleProp<ViewStyle>;
  innerBoxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}> = ({ contents, boxStyle, innerBoxStyle, labelStyle, valueStyle }) => {
  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        borderColor: AppColors.SUB_GREY,
        borderRadius: 5,
        borderWidth: 1,
        ...(boxStyle as {}),
      }}>
      {contents.map((content, i) => {
        return (
          <View
            key={String(content.label)}
            style={{
              backgroundColor: AppColors.WHITE,
              flexDirection: 'row',
              justifyContent:
                content.label && content.value ? 'space-between' : 'center',
              paddingVertical: 24,
              paddingHorizontal: 16,
              borderTopColor: AppColors.SUB_GREY,
              borderTopWidth: i === 0 ? 0 : 1,
              ...(innerBoxStyle as {}),
            }}>
            {typeof content.label === 'string' ? (
              <Text
                style={{
                  color: AppColors.SUB_BLACK,
                  fontFamily: AppFonts.Regular,
                  fontSize: 14,
                  ...(labelStyle as {}),
                }}>
                {content.label}
              </Text>
            ) : (
              <View style={{ flex: 1 }}>{content.label}</View>
            )}
            {typeof content.value === 'string' ? (
              <Text
                style={{
                  color: AppColors.BLACK,
                  fontFamily: AppFonts.Medium,
                  fontSize: 14,
                  textAlign: 'right',
                  ...(valueStyle as {}),
                }}>
                {content.value}
              </Text>
            ) : (
              <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                {content.value}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default BoxWithDivider;
