import React, { FunctionComponent } from "react";
import { StyleSheet, View, TouchableOpacity, GestureResponderEvent, Text } from "react-native";
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;
const WhiteBtn = styled.TouchableOpacity`
  background-color: #fff;
`;
const WhiteBtnText = styled.Text`
  color: #000;
  margin: 5px 20px;
  font-family: Roboto;
  font-size: 12px;
  text-align: center;
  line-height: 15px;
`;

export const FlatButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <Container>
      <WhiteBtn onPress={handler}>
        <WhiteBtnText>
          {title}
        </WhiteBtnText>
      </WhiteBtn>
    </Container>
  );
};

