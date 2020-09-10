import React, { Component, FunctionComponent } from "react";
import { StyleSheet, Text, View, Picker, Platform } from "react-native";
import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";

import RNPickerSelect from "react-native-picker-select";

import { forModalPresentationIOS } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/CardStyleInterpolators";

interface props {
  period: string;
  eventHandler: (input: string) => void;
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
    <Picker.Item label={i18n.t("info_label.all")} value="0" />,
    <Picker.Item label={i18n.t("info_label.1_month")} value="30" />,
    <Picker.Item label={i18n.t("info_label.3_months")} value="90" />,
    <Picker.Item label={i18n.t("info_label.6_months")} value="180" />,
    <Picker.Item label={i18n.t("info_label.1_year")} value="365" />,
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
          onValueChange={props.eventHandler}
        >
          {TermList_and}
        </Picker>
      ) : (
        <RNPickerSelect
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
    borderWidth: 1,
    borderColor: "#d0d8df",
    borderRadius: 5,
    color: "#1C1C1C",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
