import React, { Component, FunctionComponent } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { BackButton } from "../../shared/components/BackButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/kyc";
import { DashboardPage } from "../../enums/pageEnum";
import { useNavigation, useRoute } from "@react-navigation/native";

const H1Text = styled.Text`
  color: #626368;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  margin-top: 30px;
`;
const PText = styled.Text`
  color: #838383;
  font-size: 14px;
  text-align: left;
`;
const NumText = styled.Text`
  color: #1c1c1c;
  font-size: 40px;
  text-align: left;
  font-weight: bold;
  margin-bottom: 10px;
`;
const NumText2 = styled.Text`
  color: #1c1c1c;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: left;
  margin-left: 20px;
  font-weight: bold;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

export const TotalValue: FunctionComponent<props> = (props) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={{ backgroundColor: "#fff", width: "100%", height: "100%" }}>
      <BackButton handler={() => navigation.goBack()} />

      <View
        style={{
          width: "100%",
          height: 180,
          borderBottomWidth: 5,
          borderBottomColor: "#F6F6F8",
          paddingLeft: 20,
        }}
      >
        <H1Text>{i18n.t("dashboard_label.total_value")}</H1Text>
        <NumText>{"123,000$"}</NumText>
        <PText>{i18n.t("dashboard.total_value_desc")}</PText>
      </View>
      <View
        style={{
          width: "90%",
          left: "5%",
          position: "relative",
          backgroundColor: "#F6F6F8",
          borderRadius: 10,
          borderColor: "#F1F1F1",
          borderWidth: 1,
          height: 110,
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          padding: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <PText>{i18n.t("dashboard_label.property_value")}</PText>
          <NumText2>{"208.68$"}</NumText2>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <PText>{i18n.t("dashboard_label.usd")}</PText>
          <NumText2>{"120,000.0892$"}</NumText2>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <PText>{i18n.t("dashboard_label.el")}</PText>
          <NumText2>{"3,000.05%"}</NumText2>
        </View>
      </View>
    </View>
  );
};
