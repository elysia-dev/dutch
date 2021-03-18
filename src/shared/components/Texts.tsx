import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import styled from 'styled-components/native';

const H1Title = styled.Text`
  color: #1c1c1c;
  font-size: 28px;
  text-align: left;
  font-family: 'Roboto_700Bold';
`;

export const H1Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <H1Title style={style} allowFontScaling={false}>{label}</H1Title>;
};

const H2Title = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  text-align: left;
  font-family: 'Roboto_700Bold';
`;

export const H2Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <H2Title style={style} allowFontScaling={false}>{label}</H2Title>;
};

const P1Title = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  font-family: 'Roboto_400Regular';
  line-height: 20px;
`;

export const P1Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <P1Title style={style} allowFontScaling={false}>{label}</P1Title>;
};

const H3Title = styled.Text`
  color: #1c1c1c;
  font-size: 17px;
  text-align: left;
  font-family: 'Roboto_700Bold';
`;

export const H3Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <H3Title style={style} allowFontScaling={false}>{label}</H3Title>;
};

const H4Title = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  text-align: left;
  font-family: 'Roboto_700Bold';
`;

export const H4Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <H4Title style={style} allowFontScaling={false}>{label}</H4Title>;
};


const P2Title = styled.Text`
  color: #838383;
  font-size: 15px;
  text-align: left;
  font-family: 'Roboto_300Light';
`;

export const P2Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <P2Title style={style} allowFontScaling={false}>{label}</P2Title>;
};

const P3Title = styled.Text`
  color: #A7A7A7;
  font-size: 12px;
  text-align: left;
  font-family: 'Roboto_400Regular';
`;

export const P3Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <P3Title style={style} allowFontScaling={false}>{label}</P3Title>;
};

const P4Title = styled.Text`
  color: #A7A7A7;
  font-size: 10px;
  text-align: left;
  font-family: 'Roboto_400Regular';
`;

export const P4Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <P4Title style={style} allowFontScaling={false}>{label}</P4Title>;
};


const Title = styled.Text`
  color: #1c1c1c;
  font-size: 25px;
  text-align: left;
  font-family: 'Roboto_700Bold';
  line-height: 28px;
`;

export const TitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <Title style={style} allowFontScaling={false}>{label}</Title>;
};

const SubTitle = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-family: 'Roboto_400Regular';
  line-height: 20px;
`;

export const SubTitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <SubTitle style={style} allowFontScaling={false}>{label}</SubTitle>;
};
