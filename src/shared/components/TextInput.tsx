import React, { FunctionComponent, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import styled from "styled-components/native";

interface props {
  type: string;
  value: string;
  edit: boolean;
  eventHandler: (text: string) => void;
  secure: boolean;
  autoFocus?: boolean;
  placeHolder?: string;
}
const InputHeaderText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
`;
const InputTextForm = styled.TextInput`
  width: 90%;
  height: 25px;
  border-bottom-width: 1px;
`;
export const TextInput: FunctionComponent<props> = (
  props,
  { onFocused = false, autocapitalize = "none" }
) => {
  const [focusing, setFocus] = useState(onFocused);

  return (
    <View>
      <InputHeaderText
        style={{
          color: focusing == true ? "#2C6190" : "#A7A7A7",
        }}
      >
        {props.type}
      </InputHeaderText>
      <InputTextForm
        style={{
          borderBottomColor: focusing == true ? "#2C6190" : "#A7A7A7",
        }}
        defaultValue={props.value}
        editable={props.edit}
        onChangeText={(text) => props.eventHandler(text)}
        enablesReturnKeyAutomatically={true}
        secureTextEntry={props.secure}
        maxLength={30}
        autoCapitalize={autocapitalize}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={props.placeHolder}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
