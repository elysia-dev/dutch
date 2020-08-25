import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Text,
} from "react-native";
import styled from "styled-components/native";

const OptionBtn = styled.TouchableOpacity`
  color: #000;
  width: 90%;
  margin: 0 auto;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #d0d8df;
  display: flex;
  flex-direction: row;
`;
const OptionBtnText = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  z-index: 5;
`;

interface props {
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
  child: any;
  checked: any;
}

export const OptionButton: FunctionComponent<props> = (props) => {
  return (
    <View>
      <OptionBtn onPress={props.handler}>
        {props.child}
        <OptionBtnText>{props.title}</OptionBtnText>
        {props.checked}
      </OptionBtn>
    </View>
  );
};
