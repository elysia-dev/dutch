import React from 'react';
import { View, Text } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const DotEnded: React.FC<{
  cycle: number;
  status: 'ended' | 'inProgress' | 'scheduled';
}> = ({ cycle, status }) => {
  let backgroundColor;
  let borderColor;
  switch (status) {
    case 'ended':
      backgroundColor = AppColors.MAIN;
      borderColor = AppColors.MAIN;
      break;
    case 'inProgress':
      backgroundColor = AppColors.WHITE;
      borderColor = AppColors.MAIN;
      break;
    case 'scheduled':
      backgroundColor = AppColors.DEACTIVATED;
      borderColor = AppColors.DEACTIVATED;
      break;
    default:
      break;
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          backgroundColor,
          width: 15,
          height: 15,
          borderWidth: 1,
          borderColor,
          borderRadius: 7.5,
        }}
      />
      <Text
        style={{
          fontFamily: AppFonts.Bold,
          color: AppColors.BLACK,
          fontSize: 12,
          marginTop: 5,
        }}>{`${cycle}차`}</Text>
    </View>
  );
};

export default DotEnded;
