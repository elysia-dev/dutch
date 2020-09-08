import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/kyc";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DashboardPage, InfoPage } from "../../enums/pageEnum";

const H1Text = styled.Text`
  color: #1c1c1c;
  margin-bottom: 15px;
  text-align: left;
  font-size: 20px;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 12px;
  text-align: left;
  font-weight: 300;
`;
const TotalText = styled.Text`
  color: #2c6190;
  font-size: 40px;
  text-align: center;
  margin-top: 38px;
  font-weight: bold;
`;
const AverageText = styled.Text`
  color: #1c1c1c;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
`;
const Item = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const moreHistory = (handler: () => void) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        marginTop: 30,
        paddingTop: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
        height: 40,
        backgroundColor: "#F6F6F8",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#D0D8DF",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: "#1C1C1C",
        }}
      >
        {i18n.t("dashboard_label.more_history") + " >"}
      </Text>
    </TouchableOpacity>
  );
};

const historyItem = (name: string, rate: string, expectedSale: string) => {
  return (
    <View
      style={{
        marginTop: 15,

        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        paddingBottom: 15,
        // marginBottom: 15,
      }}
    >
      <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10, height: 50 }}>
        <Image
          source={require("./images/building.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "center",
          }}
        ></Image>
      </View>
      <View
        style={{
          flex: 4,
          flexDirection: "column",
        }}
      >
        <Item>
          <GText>{i18n.t("info_label.product_name")}</GText>
          <Text>{name}</Text>
        </Item>
        <Item>
          <GText>{i18n.t("info_label.entire_profit")}</GText>
          <Text>{`${rate}%`}</Text>
        </Item>
        <Item>
          <GText>{i18n.t("info_label.expectd_sale_profit")}</GText>
          <Text>{`${expectedSale}%`}</Text>
        </Item>
      </View>
    </View>
  );
};

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {}

export class Main extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {};
  }

  render() {
    const { route, navigation } = this.props;
    return (
      // <ScrollView>
      <ScrollView
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            backgroundColor: "#2C6190",
            height: 236,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            width: "100%",
            position: "absolute",
            top: 0,
          }}
        ></View>
        <View
          style={{
            backgroundColor: "#fff",
            height: 175,
            width: "90%",
            left: "5%",
            borderRadius: 10,
            top: 110,
            shadowOffset: { width: 0, height: 0 },
            shadowColor: "#00000033",
            shadowOpacity: 0.8,
            shadowRadius: 6,
          }}
        >
          <TotalText>{"123,000$"}</TotalText>
          <TouchableOpacity
            onPress={() => navigation.navigate(DashboardPage.TotalValue)}
          >
            <PText>{i18n.t("dashboard_label.total_value") + " >"}</PText>
          </TouchableOpacity>
          <View
            style={{
              borderColor: "#D0D8DF",
              borderTopWidth: 1,
              width: "100%",
              height: 0,
              position: "absolute",
              top: 125.5,
            }}
          ></View>
          <TouchableOpacity
            onPress={() => navigation.navigate(DashboardPage.AverageProfit)}
            style={{ elevation: 5 }}
          >
            <View
              style={{
                flexDirection: "row",
                marginLeft: "15%",
                width: "70%",
                height: 50,
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <PText>{i18n.t("dashboard_label.average_profit")}</PText>
              <AverageText>{"12.8%"}</AverageText>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            height: 0,
            borderTopWidth: 5,
            borderColor: "#F6F6F8",
            position: "relative",
            top: 130,
          }}
        ></View>
        <View
          style={{
            width: "100%",
            position: "relative",
            top: 130,
            padding: "5%",
          }}
        >
          <H1Text>{i18n.t("dashboard_label.my_investment")}</H1Text>
          <View>{historyItem("Asset #1", "4.02", "15.00")}</View>
          <View>{historyItem("Asset #1", "4.02", "15.00")}</View>
          <View>{historyItem("Asset #1", "4.02", "15.00")}</View>

          <View>
            {moreHistory(() =>
              navigation.navigate("Info", { screen: "InvestmentHistory" })
            )}
          </View>
        </View>
        {/* </View> */}
      </ScrollView>
    );
  }
}
