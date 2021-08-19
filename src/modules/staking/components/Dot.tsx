import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const Dot: React.FC<{
  cycle: 1 | 2 | 3 | 4 | 5 | 6;
  status: 'ended' | 'inProgress' | 'scheduled';
  selected: boolean;
  setSelectedCycle: Dispatch<SetStateAction<number>>;
}> = ({ cycle, status, selected, setSelectedCycle }) => {
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
    <TouchableOpacity
      style={{ alignItems: 'center' }}
      onPress={() => {
        setSelectedCycle(cycle);
      }}
      activeOpacity={1}>
      <View
        style={{
          backgroundColor,
          width: 15,
          height: 15,
          borderWidth: 1,
          borderColor,
          borderRadius: 7.5,
          shadowColor: AppColors.SHADOW_BLACK,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 1,
          elevation: selected ? 6 : 0,
        }}
      />
      <Text
        style={{
          fontFamily: AppFonts.Bold,
          color: AppColors.BLACK,
          fontSize: 12,
          marginTop: 6,
        }}>{`${cycle}차`}</Text>
    </TouchableOpacity>
  );
};

export default Dot;
