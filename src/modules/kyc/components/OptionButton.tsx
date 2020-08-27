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
  margin: 5px auto;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  border: solid 1px ${props => props.checking == "selected" ? "#3679B5" : "#d0d8df"};
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
const OptionBtnChecked = styled.View`
  flex-direction: row;
  margin-left: auto;
`;

interface props {
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: any;
  child: any;
  checked: any;
  selected?: string;
}

export const OptionButton: FunctionComponent<props> = (props) => {
  return (
    <View>
      <OptionBtn onPress={props.handler} checking={props.selected}>
        {props.child}
        <OptionBtnText>{props.title}</OptionBtnText>
        <OptionBtnChecked>{props.checked}</OptionBtnChecked>
      </OptionBtn>
    </View>
  );
};
