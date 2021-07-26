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
        return (
          <TouchableOpacity
            key={index}
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 2,
              borderBottomColor:
                index === selected ? AppColors.BLACK : AppColors.GREY,
            }}
            onPress={() => select(index)}>
            <H4Text label={option} style={{ textAlign: 'center' }} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SelectBox;
