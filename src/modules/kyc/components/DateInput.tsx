import React, { FunctionComponent, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
  StyleProp,
  ViewStyle,
} from "react-native";
import DatePicker from "react-native-datepicker";
import styled from "styled-components/native";

interface props {
  type: string;
  eventHandler: (input: string) => void;
  birthday: string;
  style?: StyleProp<ViewStyle>;
}

const InputHeaderText = styled.Text`
  color: #a7a7a7;
  font-size: 12px;
  text-align: left;
`;
const InputTextForm = styled.TextInput`
  height: 25px;
  border-bottom-width: 1px;
  border-bottom-color: #a7a7a7;
`;

export const DateInput: FunctionComponent<props> = (props) => {
  const currentDate = new Date();

  return (
    <View style={props.style}>
      <InputHeaderText>{props.type}</InputHeaderText>
      <DatePicker
        style={{ width: "90%" }}
        date={props.birthday}
        onDateChange={props.eventHandler}
        mode="date"
        androidMode="spinner"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="1900-01-01"
        maxDate={currentDate}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          btnTextConfirm: {
            color: "#3679B5",
          },
          dateIcon: {
            opacity: 0,
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#D0D8DF",
          },
        }}
      />
    </View>
  );
};
