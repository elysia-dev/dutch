import React, { FunctionComponent } from 'react';
import { StyleProp, ViewStyle, TextStyle, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppColors from '../../enums/AppColors';
import AppFonts from '../../enums/AppFonts';

interface INextButton {
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const NextButton: FunctionComponent<INextButton> = ({
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
        backgroundColor: disabled ? AppColors.BLUE_2 : AppColors.MAIN,
        ...(style as {}),
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        height: 50,
      }}>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          fontFamily: AppFonts.Bold,
          color: '#F5F5F5',
        }}
        allowFontScaling={false}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default NextButton;
