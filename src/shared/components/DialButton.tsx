import React, { FunctionComponent } from 'react';
import { TouchableHighlight } from 'react-native';
import { H2Text } from './Texts';
import AppFonts from '../../enums/AppFonts';

const DialButton: FunctionComponent<{
  pressHandler: () => void;
  value: string;
}> = ({ pressHandler, value }) => {
  return (
    <TouchableHighlight
      style={{
        width: 100,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        marginHorizontal: 4,
      }}
      onPress={() => pressHandler()}
      underlayColor="#F0F0F0"
      activeOpacity={0.5}>
      <H2Text
        label={value}
        style={{ textAlign: 'center', fontFamily: AppFonts.Medium }}
      />
    </TouchableHighlight>
  );
};

export default DialButton;
