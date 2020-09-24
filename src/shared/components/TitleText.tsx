import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import styled from 'styled-components/native';

const Title = styled.Text`
  color: #1c1c1c;
  font-size: 28px;
  font-weight: bold;
  text-align: left;
  line-height: 28px;
  height: 28px;
`;

export const TitleText: FunctionComponent<{
  label: string;
  style?: StyleProp<TextStyle>;
  // handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <Title style={style}>{label}</Title>;
};
