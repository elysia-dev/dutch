import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';

export const SubTitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: '#1c1c1c',
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
