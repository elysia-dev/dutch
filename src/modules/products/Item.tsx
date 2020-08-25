import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";

interface props {
  annualReturn: string;
  series: string;
}

export const Products: FunctionComponent<props> = (props) => {
  return (
    <View
      style={{
        width: "90%",
        borderRadius: 6,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 6,
      }}
    ></View>
  );
};
