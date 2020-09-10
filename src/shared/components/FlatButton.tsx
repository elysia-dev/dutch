import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Text,
} from "react-native";
import styled from "styled-components/native";

const Container = styled.View``;
const WhiteBtn = styled.TouchableOpacity``;
const WhiteBtnText = styled.Text`
  color: #000;
  margin: 5px 20px;
  font-size: 12px;
  text-align: center;
`;

export const FlatButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <Container>
      <WhiteBtn onPress={handler}>
        <WhiteBtnText>{title}</WhiteBtnText>
      </WhiteBtn>
    </Container>
  );
};
