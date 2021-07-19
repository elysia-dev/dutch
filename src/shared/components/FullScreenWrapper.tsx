import React from 'react';
import { SafeAreaView, Platform, StyleProp, ViewStyle } from 'react-native';

const FullScreenWrapper: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        height: '100%',
        backgroundColor: '#fff',
        overflow: 'hidden',
        ...(style as {}),
      }}
    />
  );
};

export default FullScreenWrapper;