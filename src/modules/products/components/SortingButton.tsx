import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Text,
} from "react-native";
import styled from "styled-components/native";
import BlueCheckPng from "../images/bluecheck.png";

const OptionBtn = styled.TouchableOpacity`
  width: 80px;
  margin: 0 auto;
  height: 30px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #d0d8df;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  padding-bottom: 5px;
`;
const CheckedOptionBtn = styled.TouchableOpacity`
  width: 80px;
  margin: 0 auto;
  height: 30px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px #35a1fa;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  padding-bottom: 5px;
`;
const OptionBtnText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  z-index: 5;
  justify-content: center;
  align-content: center;
`;
const CheckedOptionBtnText = styled.Text`
  color: #1c1c1c;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  z-index: 5;
`;
const BlueCheckImg = styled.Image`
  width: 12px;
  height: 12px;
  top: 8px;
  margin-left: 3px;
`;

export const SortingButton: FunctionComponent<{
  check: boolean;
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
}> = ({ title, handler, check }) => {
  if (check) {
    return (
      <CheckedOptionBtn onPress={handler}>
        <CheckedOptionBtnText>{title}</CheckedOptionBtnText>
        <BlueCheckImg source={BlueCheckPng} />
      </CheckedOptionBtn>
    );
  } else {
    return (
      <OptionBtn onPress={handler}>
        <OptionBtnText>{title}</OptionBtnText>
      </OptionBtn>
    );
  }
};
