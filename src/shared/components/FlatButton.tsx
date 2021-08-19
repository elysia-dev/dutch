import React, { FunctionComponent } from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { P3Text } from './Texts';
import AppColors from '../../enums/AppColors';

export const FlatButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}> = ({ title, handler, style }) => {
  return (
    <TouchableOpacity onPress={handler} style={style}>
      <P3Text
        label={title}
        style={{
          color: AppColors.BLACK,
          fontSize: 13,
          lineHeight: 15,
          textAlign: 'center',
        }}
      />
    </TouchableOpacity>
  );
};
