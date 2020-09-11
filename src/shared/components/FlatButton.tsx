import React, { FunctionComponent } from "react";
import {
  GestureResponderEvent,
} from "react-native";
import styled from "styled-components/native";

const WhiteBtn = styled.TouchableOpacity`
`;
const WhiteBtnText = styled.Text`
  color: #000;
  font-size: 12px;
  text-align: center;
`;

export const FlatButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <WhiteBtn onPress={handler}>
      <WhiteBtnText>{title}</WhiteBtnText>
    </WhiteBtn>
  );
};
