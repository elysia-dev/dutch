import React, { FunctionComponent } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { P3Text } from './Texts';
import AppColors from '../../enums/AppColors';

const FlatBorderButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#36a1ff',
        height: 21,
        paddingVertical: 3,
        paddingHorizontal: 21,
      }}>
      <P3Text
        label={title}
        style={{
          color: AppColors.BLACK,
          textAlign: 'center',
          lineHeight: 15,
        }}
      />
    </TouchableOpacity>
  );
};

export default FlatBorderButton;
