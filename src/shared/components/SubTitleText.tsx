import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';
import AppColors from '../../enums/AppColors';

export const SubTitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK,
        fontSize: 15,
        textAlign: 'left',
        lineHeight: 20,
        ...(style as {}),
      }}
    >
      {label}
    </Text>
  );
};
