import React, { FunctionComponent } from 'react';
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppFonts from '../../enums/AppFonts';
import AppColors from '../../enums/AppColors';

const handleThemeType = (variant: string | undefined) => {
  switch (variant) {
    case 'WhiteTheme':
      return {
        borderWidth: 1,
        borderColor: AppColors.MAIN,
        backgroundColor: AppColors.WHITE,
      };
    case 'GrayTheme':
      return {
        borderWidth: 0,
        borderColor: AppColors.WHITE,
        backgroundColor: '#AAAAAA',
      };
    case '':
    case undefined:
    default:
      return {
        borderWidth: 0,
        borderColor: AppColors.WHITE,
        backgroundColor: AppColors.MAIN,
      };
  }
};

interface SubmitButtonProps {
  title: string;
  handler: any;
  variant?: 'WhiteTheme' | 'GrayTheme' | ''; // WhiteTheme를 받으면 하얀색 버튼으로 변경됩니다
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  duplicateTitle?: string;
}

export const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  title,
  handler,
  variant,
  disabled,
  style,
  textStyle,
  duplicateTitle,
}) => {
  return (
    <TouchableOpacity
      onPress={handler}
      disabled={disabled}
      style={{
        width: '90%',
        height: 50,
        marginHorizontal: '5%',
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        ...handleThemeType(variant),
        ...(style as {}),
      }}>
      {duplicateTitle === undefined ? (
        <Text
          style={{
            fontSize: variant === 'WhiteTheme' ? 14 : 16,
            textAlign: 'center',
            lineHeight: 40,
            fontFamily:
              variant === 'GrayTheme' ? AppFonts.Regular : AppFonts.Bold,
            color: variant === 'WhiteTheme' ? '#000000' : AppColors.WHITE,
            ...(textStyle as {}),
          }}
          allowFontScaling={false}>
          {title}
        </Text>
      ) : (
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 14,
            textAlign: 'left',
            marginLeft: '6%',
            color: variant === 'WhiteTheme' ? '#000000' : AppColors.WHITE,
            fontFamily: AppFonts.Regular,
          }}>
          {duplicateTitle}
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 16,
              textAlign: 'left',
              color: variant === 'WhiteTheme' ? '#000000' : AppColors.WHITE,
              fontFamily: AppFonts.Bold,
            }}>
            {'\n'}
            {title}
          </Text>
        </Text>
      )}
    </TouchableOpacity>
  );
};
