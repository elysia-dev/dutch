import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import styled from 'styled-components/native';

const PTitle = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  text-align: left;
`;

export const PText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <PTitle style={style}>{label}</PTitle>;
};
