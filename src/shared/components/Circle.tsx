import React, { FunctionComponent } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

const Circle: FunctionComponent<{ style: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 10,
        ...(style as {}),
      }}
    />
  );
};

export default Circle;