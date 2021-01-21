import React, { FunctionComponent } from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { P3Text } from './Texts';

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
          color: '#1c1c1c',
          fontSize: 13,
          lineHeight: 15,
          textAlign: 'center',
        }}
      />
    </TouchableOpacity>
  );
};
