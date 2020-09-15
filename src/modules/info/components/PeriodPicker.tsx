import React, { Component, FunctionComponent } from "react";
import { StyleSheet, Text, View, Picker, Platform } from "react-native";
import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";

import RNPickerSelect from "react-native-picker-select";

interface props {
  period: string;
  eventHandler: (input: string) => void;
  resetHandler: () => void;
}

interface placeholder {
  label: string;
  value: string;
  color: string;
}

export const PeriodPicker: FunctionComponent<props> = (props) => {
  const TermList_ios = [
    {
      label: i18n.t("info_label.all"),
      value: "0",
    },
    {
      label: i18n.t("info_label.1_month"),
      value: "30",
    },
    {
      label: i18n.t("info_label.3_months"),
      value: "90",
    },
    {
      label: i18n.t("info_label.6_months"),
      value: "180",
    },
    {
      label: i18n.t("info_label.1_year"),
      value: "365",
    },
  ];

  const TermList_and = [
    <Picker.Item label={i18n.t("info_label.all")} value="0" key={0} />,
    <Picker.Item label={i18n.t("info_label.1_month")} value="30" key={1} />,
    <Picker.Item label={i18n.t("info_label.3_months")} value="90" key={2} />,
    <Picker.Item label={i18n.t("info_label.6_months")} value="180" key={3} />,
    <Picker.Item label={i18n.t("info_label.1_year")} value="365" key={4} />,
  ];

  const placeholder: placeholder = {
    label: i18n.t("info_label.term"),
    value: "0",
    color: "#4E4E4E",
  };

  return (
    <View>
      {Platform.OS === "android" ? (
        <Picker
          // mode="dropdown"
          selectedValue={props.period}
          onValueChange={(input: string) => {
            props.eventHandler(input);
            props.resetHandler();
          }}
        >
          {TermList_and}
        </Picker>
      ) : (
        <RNPickerSelect
          onClose={props.resetHandler}
          value={props.period}
          onValueChange={props.eventHandler}
          items={TermList_ios}
          style={pickerSelectStyles}
          placeholder={placeholder}
        />
      )}
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 5,
    fontSize: 14,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#d0d8df",
    borderRadius: 5,
    color: "#1C1C1C",
  },
  inputAndroid: {
    width: "90%",
    height: 40,
    backgroundColor: "#fff",
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 5,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#d0d8df",
    borderRadius: 5,
    color: "#1C1C1C",
  },
});
