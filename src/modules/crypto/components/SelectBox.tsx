import React from 'react';
import { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import AppColors from '../../../enums/AppColors';
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
    if (selectType === 'day') {
      if (index === 0) {
        select(1);
      } else if (index === 1) {
        select(2);
      } else {
        select(4);
      }
    } else {
      select(index);
    }
  };

  const borderBottomColor = (index: number): number => {
    if (selectType === 'day') {
      if (index === 0) {
        return 1;
      } else if (index === 1) {
        return 2;
      } else {
        return 4;
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
