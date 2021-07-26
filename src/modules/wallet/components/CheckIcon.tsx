import React from 'react';
import { View, Text } from 'react-native';
import AppColors from '../../../enums/AppColors';

interface ICheckIcon {
  checked: boolean;
}

const CheckIcon: React.FC<ICheckIcon> = (props) => {
  return (
    <View
      style={{
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: props.checked ? AppColors.MAIN : AppColors.GREY,
      }}>
      <Text
        style={{ textAlign: 'center', color: AppColors.WHITE, marginTop: 2 }}>
        ✓
      </Text>
    </View>
  );
};

export default CheckIcon;
