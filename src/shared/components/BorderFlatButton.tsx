import React, { FunctionComponent } from "react";
import {
  GestureResponderEvent,
} from "react-native";
import styled from "styled-components/native";

const WhiteBtn = styled.TouchableOpacity`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: #36a1ff;
  color: #1c1c1c;
  height: 21px;
  padding: 3px 21px;
`;
const WhiteBtnText = styled.Text`
  color: #000;
  font-size: 12px;
  text-align: center;
`;

const FlatBorderButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <WhiteBtn onPress={handler}>
      <WhiteBtnText>{title}</WhiteBtnText>
    </WhiteBtn>
  );
};

export default FlatBorderButton