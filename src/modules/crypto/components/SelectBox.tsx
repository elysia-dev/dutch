import React, { useCallback } from 'react';

import { View, TouchableOpacity } from 'react-native';
import AppColors from '../../../enums/AppColors';
import ChartTabDays from '../../../enums/ChartTabDays';
import SelectType from '../../../enums/SelectType';
import { H4Text } from '../../../shared/components/Texts';

interface ISelectBox {
  options: string[];
  selected: number;
  select: (id: number) => void;
  selectType: string;
}

export const SelectBox: React.FC<ISelectBox> = ({
  options,
  selected,
  select,
  selectType,
}) => {
  const onPress = (index: number): void => {
    if (selectType === SelectType.Day) {
      if (index === 0) {
        select(ChartTabDays.OneWeek);
      } else if (index === 1) {
        select(ChartTabDays.TwoWeeks);
      } else {
        select(ChartTabDays.OneMonth);
      }
    } else {
      select(index);
    }
  };

  const borderBottomColor = (index: number): number => {
    if (selectType === 'day') {
      if (index === 0) {
        return ChartTabDays.OneWeek;
      } else if (index === 1) {
        return ChartTabDays.TwoWeeks;
      } else {
        return ChartTabDays.OneMonth;
      }
    }
    return index;
  };
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      {options.map((option, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 2,
              borderBottomColor:
                borderBottomColor(index) === selected
                  ? AppColors.BLACK
                  : AppColors.GREY,
            }}
            onPress={() => onPress(index)}>
            <H4Text label={option} style={{ textAlign: 'center' }} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SelectBox;
