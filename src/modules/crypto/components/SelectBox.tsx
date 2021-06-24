import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import AppColors from '../../../enums/AppColors';
import { H4Text } from '../../../shared/components/Texts';

interface ISelectBox {
  options: string[];
  selected: number;
  select: (id: number) => void;
}

export const SelectBox: React.FC<ISelectBox> = ({
  options,
  selected,
  select,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      {options.map((option, index) => {
        let currentNum;
        if (index === 0) {
          currentNum = 1;
        } else if (index === 1) {
          currentNum = 2;
        } else {
          currentNum = 4;
        }
        return (
          <TouchableOpacity
            key={index}
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 2,
              borderBottomColor:
                currentNum === selected ? AppColors.BLACK : AppColors.GREY,
            }}
            onPress={() => {
              index === 0 ? select(1) : index === 1 ? select(2) : select(4);
            }}>
            <H4Text label={option} style={{ textAlign: 'center' }} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SelectBox;
