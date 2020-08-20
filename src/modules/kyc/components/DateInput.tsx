import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View, TextInput as RNTextInput } from "react-native";
import styled from "styled-components/native";

interface props {
  type: string;
  value: string;
  edit: boolean;
  eventHandler: (text: string) => void;
  secure: boolean;
}

const InputHeaderText = styled.Text`
  color: #a7a7a7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;
const InputTextForm = styled.TextInput`
  width: 90%;
  margin: 8px auto;
  height: 25px;
  border-bottom-width: 1px;
  border-bottom-color: #a7a7a7;
`;

export const DataInput: FunctionComponent<props> = (props) => {
  return (
    <View>
      <InputHeaderText>{props.type}</InputHeaderText>
      <InputTextForm
        defaultValue={props.value}
        editable={props.edit}
        onChangeText={(text) => props.eventHandler(text)}
        enablesReturnKeyAutomatically={true}
        secureTextEntry={props.secure}
        maxLength={30}
        // minLength={8}
      />
    </View>
  );
};
