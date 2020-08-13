import React, { FunctionComponent } from "react";
import { StyleSheet, View, TouchableOpacity, GestureResponderEvent, Text } from "react-native";
import styled from 'styled-components/native';

const WhiteBtn = styled.TouchableOpacity`
  color: #000;
  width: 90%;
  margin: 0 auto;
  height: 40px;
  background-color: #2C6190;
  border-radius: 5px;
`;
const WhiteBtnText = styled.Text`
  color: #fff;
  font-family: Roboto;
  font-size: 14px;
  text-align: center;
  line-height: 40px;  
`;

export const SubmitButton: FunctionComponent<{
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
}> = ({ title, handler }) => {
  return (
    <View>
      <WhiteBtn onPress={handler}>
        <WhiteBtnText>
          {title}
        </WhiteBtnText>
      </WhiteBtn>
    </View>
  );
};