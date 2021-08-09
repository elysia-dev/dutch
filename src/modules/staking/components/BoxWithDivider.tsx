import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import AppColors from '../../../enums/AppColors';

const BoxWithDivider: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  return (
    <View
      style={{
        backgroundColor: AppColors.WHITE,
        borderColor: AppColors.SUB_GREY,
        borderRadius: 5,
        borderWidth: 1,
        ...(style as {}),
      }}>
      {children}
    </View>
  );
};

export default BoxWithDivider;
