import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import AppColors from '../../../enums/AppColors';

const TouchableCardWithShadow: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ children, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: AppColors.WHITE,
        shadowColor: AppColors.SHADOW_BLACK,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 6,
        shadowOpacity: 1,
        elevation: 6,
        borderRadius: 5,
        ...(style as {}),
      }}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableCardWithShadow;
