import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';
import AppFonts from '../../enums/AppFonts';

export const TitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      allowFontScaling={false}
      style={{
        color: '#1c1c1c',
        fontSize: 28,
        textAlign: 'left',
        fontFamily: AppFonts.Bold,
        lineHeight: 28,
        ...(style as {}),
      }}
    >
      {label}
    </Text>
  );
};
