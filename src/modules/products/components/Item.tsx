import React, { Component, FunctionComponent, Props } from "react";
import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  Image,
} from "react-native";

import styled from "styled-components/native";
import i18n from "../../../i18n/i18n";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin-bottom: 5px;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 12px;
  text-align: center;
  line-height: 20px;
`;

interface props {
  annualReturn: string;
}

export const Item: FunctionComponent<props> = (props) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginLeft: "5%",
        width: "90%",
        height: 100,
        borderRadius: 6,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "#00000029",
        shadowOpacity: 0.8,
        shadowRadius: 6,
        flex: 1,
        flexDirection: "row",
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <View style={{ flex: 2, flexDirection: "column" }}>
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
              marginRight: 10,
            }}
          >
            <PText style={{ color: "#626368" }}>
              {i18n.t("product_label.return_on_rent")}
            </PText>
          </View>

          <View
            style={{
              borderRadius: 3,
              backgroundColor: "#A7A7A7",
              width: 60,
              height: 20,
            }}
          >
            <PText style={{ color: "#fff" }}>
              {i18n.t("product_label.return_on_sale")}
            </PText>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Image
          source={require("../images/building.png")}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        ></Image>
      </View>
    </View>
  );
};
