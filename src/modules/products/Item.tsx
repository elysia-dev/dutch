import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";

import styled from "styled-components/native";
import i18n from "../../i18n/i18n";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin-bottom: 15px
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #626368;
  text-align: left;
  margin: 5px auto 32px auto;
  width: 90%;
`;

interface props {
  annualReturn: string;
}

export const Item: FunctionComponent<props> = (props) => {
  return (
    <View
      style={{
        left: "5%",
        width: "90%",
        height: 100,
        borderRadius: 6,
        // borderWidth: 1,
        // borderColor: "#00000029",
        shadowOffset: { width: 0, height: 0 },
        elevation: 1,
        shadowColor: "#00000029",
        shadowOpacity: 0.8,
        shadowRadius: 6,
        flex: 1,
        flexDirection: "column",
        padding: 20,
        marginTop: 5,
        marginBottom: 20,
      }}
    >
      <H1Text>
        {i18n.t("product_label.expected_annual_return", {
          return: props.annualReturn,
        })}
      </H1Text>

      <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
        <View
          style={{
            borderRadius: 3,
            backgroundColor: "#E6ECF2",
            width: 50,
            height: 20,
            paddingLeft: 14,
            paddingTop: 3,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "#626368" }}>
            {i18n.t("product_label.return_on_rent")}
          </Text>
        </View>

        <View
          style={{
            borderRadius: 3,
            backgroundColor: "#A7A7A7",
            width: 60,
            height: 20,
            paddingLeft: 8,
            paddingTop: 3,
          }}
        >
          <Text style={{ color: "#fff" }}>
            {i18n.t("product_label.return_on_sale")}
          </Text>
        </View>
      </View>
    </View>
  );
};
