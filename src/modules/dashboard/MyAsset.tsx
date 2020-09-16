import { useNavigation } from "@react-navigation/native";
import React, { Component, FunctionComponent } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";
import { AverageReturnCard } from "./components/AverageReturnCard";
import { TotalBalanceCard } from "./components/TotalBalanceCard";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 28px;
  text-align: left;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 30px;
`;

interface props {}

export const MyAsset: FunctionComponent<props> = (props) => {
  const navigation = useNavigation();
  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        top: 0,
        backgroundColor: "#F6F6F8",
        padding: 20,
      }}
    >
      <BackButton
        style={{ marginTop: 50 }}
        handler={() => navigation.goBack()}
      />

      <H1Text>{i18n.t("dashboard_label.my_asset_management")}</H1Text>
      <TotalBalanceCard balance={"$33.58"} />
      <AverageReturnCard return={"8.58%"} />
    </ScrollView>
  );
};
