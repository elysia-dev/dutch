import React, { FunctionComponent } from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

const H1Title = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
`;

export const H1Text: FunctionComponent<{
  label: string;
  style?: StyleProp<ViewStyle>;
  //handler: (event: GestureResponderEvent) => void;
}> = ({ label, style }) => {
  return <H1Title style={style}>{label}</H1Title>;
};
