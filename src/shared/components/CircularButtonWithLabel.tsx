import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import AppColors from '../../enums/AppColors';
import AppFonts from '../../enums/AppFonts';

const CircularButtonWithLabel: React.FC<{
  disabled?: boolean;
  icon: '+' | '-' | '⤴';
  label: string;
  pressHandler: any;
}> = ({ disabled, icon, label, pressHandler }) => {
  let source;
  switch (icon) {
    case '+':
      if (disabled) {
        source = require('../assets/images/plus_button_deactivated.png');
      } else {
        source = require('../assets/images/plus_button.png');
      }
      break;
    case '-':
      if (disabled) {
        source = require('../assets/images/minus_button_deactivated.png');
      } else {
        source = require('../assets/images/minus_button.png');
      }
      break;
    case '⤴':
      if (disabled) {
        source = require('../assets/images/arrow-up_button_deactivated.png');
      } else {
        source = require('../assets/images/arrow-up_button.png');
      }
      break;
    default:
      break;
  }

  return (
    <View>
      <TouchableOpacity disabled={disabled} onPress={pressHandler}>
        <Image
          source={source}
          style={{
            width: disabled ? 54 : 72,
            height: disabled ? 54 : 72,
            margin: disabled ? 9 : 0,
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: AppFonts.Medium,
          fontSize: 13,
          color: disabled ? AppColors.BLUE_2 : AppColors.BLACK,
          textAlign: 'center',
          marginTop: 4,
        }}>
        {label}
      </Text>
    </View>
  );
};

export default CircularButtonWithLabel;
