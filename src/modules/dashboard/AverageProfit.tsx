import React, { Component, FunctionComponent } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { BackButton } from "../../shared/components/BackButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { UserResponse } from "../../api/account";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

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

type ParamList = {
  UserInfo: {
    user: UserResponse;
  };
};

export const AverageProfit: FunctionComponent<props> = (props) => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "UserInfo">>();
  const dashboardInfo = route.params.user.dashboard.summary.profits;

  return (
    <View style={{ backgroundColor: "#fff", width: "100%", height: "100%" }}>
      <View style={{ paddingTop: 40, paddingLeft: 20 }}>
        <BackButton handler={() => navigation.goBack()} />
      </View>
      <View
        style={{
          width: "100%",
          height: 180,
          borderBottomWidth: 5,
          borderBottomColor: "#F6F6F8",
          paddingLeft: 20,
        }}
      >
        <H1Text>{i18n.t("dashboard_label.average_profit")}</H1Text>
        <NumText>{`${parseInt(dashboardInfo.returnOnRent) +
          parseInt(dashboardInfo.returnOnSale)}%`}</NumText>
        <PText>{i18n.t("dashboard.average_profit_desc")}</PText>
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
          <PText>{i18n.t("dashboard_label.rent_rate")}</PText>
          <NumText2>{`${dashboardInfo.returnOnRent}%`}</NumText2>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <PText>{i18n.t("dashboard_label.monthly_profit")}</PText>
          <NumText2>{`${dashboardInfo.returnOfMonth}$`}</NumText2>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <PText>{i18n.t("dashboard_label.expected_sale_rate")}</PText>
          <NumText2>{`${dashboardInfo.returnOnSale}%`}</NumText2>
        </View>
      </View>
    </View>
  );
};
