import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';
import RoundStatus from '../../../enums/RoundStatus';

const Dot: React.FC<{
  round: 1 | 2 | 3 | 4 | 5 | 6;
  status: RoundStatus;
  selected: boolean;
  setSelectedRound?: Dispatch<SetStateAction<number>>;
}> = ({ round, status, selected, setSelectedRound }) => {
  const { t } = useTranslation();

  let backgroundColor;
  let borderColor;
  let shadowOpacity = 0;
  let elevation = 0;
  switch (status) {
    case RoundStatus.ENDED:
      backgroundColor = AppColors.WHITE;
      borderColor = AppColors.MAIN;
      break;
    case RoundStatus.IN_PROGRESS:
      backgroundColor = AppColors.WHITE;
      borderColor = AppColors.MAIN;
      shadowOpacity = 1;
      elevation = 6;
      break;
    case RoundStatus.SCHEDULED:
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
        if (setSelectedRound) setSelectedRound(round);
      }}
      activeOpacity={1}>
      <View
        style={{
          backgroundColor: selected ? AppColors.MAIN : backgroundColor,
          width: 15,
          height: 15,
          borderWidth: 1,
          borderColor: selected ? AppColors.MAIN : borderColor,
          borderRadius: 7.5,
          shadowColor: AppColors.SHADOW_BLACK,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity,
          elevation,
        }}
      />
      <Text
        style={{
          fontFamily: AppFonts.Bold,
          color: AppColors.BLACK,
          fontSize: 12,
          marginTop: 6,
        }}>
        {t('staking.round_with_affix', { round })}
      </Text>
    </TouchableOpacity>
  );
};

export default Dot;
