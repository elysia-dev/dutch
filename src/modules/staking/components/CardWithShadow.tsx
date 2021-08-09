import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import AppColors from '../../../enums/AppColors';

const CardWithShadow: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  return (
    <View
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
    </View>
  );
};

export default CardWithShadow;
