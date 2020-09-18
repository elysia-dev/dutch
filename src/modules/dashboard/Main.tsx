import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import i18n from "../../i18n/i18n";
import { BalanceCard } from "./components/BalanceCard";
import { Asset } from "./components/Asset";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { DashboardPage } from "../../enums/pageEnum";

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}
interface state {}

export class Main extends Component<props, state> {
  render() {
    const { navigation } = this.props;

    return (
      <ScrollView
        style={{
          width: "100%",
          height: "100%",
          top: 0,
          backgroundColor: "#FAFCFF",
        }}
      >
        <View style={{ paddingTop: 90, height: "100%", padding: 20 }}>
          <BalanceCard
            balance={"$30.00"}
            profit={"+ $3.18"}
            handler={() =>
              navigation.navigate("Dashboard", {
                screen: DashboardPage.SummaryReport,
              })
            }
          />

          <Asset name={"Asset1"} investment={"$15.00"} profit={"+ $2.53"} />
          <Asset name={"Asset2"} investment={"$15.00"} profit={"+ $2.53"} />
          <Asset name={"Asset3"} investment={"$15.00"} profit={"+ $2.53"} />
          <Asset name={"Asset4"} investment={"$15.00"} profit={"+ $2.53"} />

          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              borderRadius: 5,
              backgroundColor: "#E6ECF2",
              justifyContent: "center",
              alignContent: "center",
            }}
            onPress={() => {}}
          >
            <Text
              style={{
                textAlignVertical: "center",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 25,
                color: "#838383",
              }}
            >
              {"+"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
