import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';
import AppFonts from '../../enums/AppFonts';
import AppColors from '../../enums/AppColors';

export const H1Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK,
        fontSize: 28,
        textAlign: 'left',
        fontFamily: AppFonts.Bold,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const H2Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK,
        fontSize: 25,
        textAlign: 'left',
        fontFamily: AppFonts.Bold,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const P1Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK,
        fontSize: 15,
        textAlign: 'left',
        fontFamily: AppFonts.Regular,
        lineHeight: 20,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const H3Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK,
        fontSize: 17,
        textAlign: 'left',
        fontFamily: AppFonts.Bold,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const H4Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK,
        fontSize: 14,
        textAlign: 'left',
        fontFamily: AppFonts.Bold,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const P2Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK2,
        fontSize: 15,
        textAlign: 'left',
        fontFamily: AppFonts.Light,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const P3Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.TEXT_GREY,
        fontSize: 12,
        textAlign: 'left',
        fontFamily: AppFonts.Regular,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const P4Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.TEXT_GREY,
        fontSize: 10,
        textAlign: 'left',
        fontFamily: AppFonts.Regular,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const TitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK,
        fontSize: 25,
        textAlign: 'left',
        fontFamily: AppFonts.Bold,
        lineHeight: 28,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};

export const SubTitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
}> = ({ label, style }) => {
  return (
    <Text
      style={{
        color: AppColors.BLACK2,
        fontSize: 15,
        textAlign: 'left',
        fontFamily: AppFonts.Regular,
        lineHeight: 20,
        ...(style as {}),
      }}
      allowFontScaling={false}>
      {label}
    </Text>
  );
};
