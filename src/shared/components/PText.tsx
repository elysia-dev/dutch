import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import styled from 'styled-components/native';

const PTitle = styled.Text`
  color: #1c1c1c;
  font-size: 15px;
  text-align: left;
  font-family: 'Roboto_400Regular';
  line-height: 15px;
`;

export const PText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <PTitle style={style}>{label}</PTitle>;
};
