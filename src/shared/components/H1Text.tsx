import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import styled from 'styled-components/native';

const H1Title = styled.Text`
  color: #1c1c1c;
  font-size: 28px;
  text-align: left;
  font-family: 'Roboto_700Bold';
  line-height: 28px;
`;

export const H1Text: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <H1Title style={style}>{label}</H1Title>;
};
