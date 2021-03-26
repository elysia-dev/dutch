import React, { FunctionComponent } from 'react';
import { StyleProp, ViewStyle, TextStyle, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppColors from '../../enums/AppColors';
import AppFonts from '../../enums/AppFonts';

interface IBorderButton {
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const BorderButton: FunctionComponent<IBorderButton> = ({
  title,
  handler,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={handler}
      disabled={disabled}
      style={{
        ...style as {},
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        borderColor: disabled ? AppColors.GREY : AppColors.MAIN,
        borderWidth: 1,
        height: 50,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          fontFamily: AppFonts.Bold,
          color: disabled ? AppColors.GREY : AppColors.MAIN,
        }}
        allowFontScaling={false}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default BorderButton