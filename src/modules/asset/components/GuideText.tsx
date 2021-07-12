import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import AppFonts from '../../../enums/AppFonts';

interface Props {
  text: string
  style?: StyleProp<TextStyle>
}

const GuideText: React.FC<Props> = ({
  text,
  style,
}) => {
  return (
    <Text
      style={{
        ...(style as {}),
        textAlign: 'right',
        color: '#848484',
        fontSize: 12,
        fontFamily: AppFonts.Regular,
      }}
    >
      {text}
    </Text>
  );
}

export default GuideText;