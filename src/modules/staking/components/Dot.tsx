import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';

const Dot: React.FC<{
  round: 1 | 2 | 3 | 4 | 5 | 6;
  status: 'ended' | 'inProgress' | 'scheduled';
  selected: boolean;
  setSelectedRound: Dispatch<SetStateAction<number>>;
}> = ({ round, status, selected, setSelectedRound }) => {
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
        setSelectedRound(round);
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
          shadowOpacity: selected ? 1 : 0,
          elevation: selected ? 6 : 0,
        }}
      />
      <Text
        style={{
          fontFamily: AppFonts.Bold,
          color: AppColors.BLACK,
          fontSize: 12,
          marginTop: 6,
        }}>{`${round}차`}</Text>
    </TouchableOpacity>
  );
};

export default Dot;
