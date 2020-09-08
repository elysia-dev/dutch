import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { InfoPage } from "../../enums/pageEnum";
import { BackButton } from "../../shared/components/BackButton";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 15px;
`;
const GText = styled.Text`
  color: #838383;
  font-size: 12px;
  text-align: left;
`;
const Item = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {}

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

export class InvestmentHistory extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { navigation, route } = this.props;
    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          height: "100%",
          padding: 20,
        }}
      >
        <BackButton
          handler={() => navigation.navigate(InfoPage.MainInfo)}
        ></BackButton>
        <H1Text>{i18n.t("info_label.my_inv_history")}</H1Text>
        <View>{historyItem("Asset #1", "4.02", "15.00")}</View>
        <View>{historyItem("Asset #2", "4.02", "15.00")}</View>
      </View>
    );
  }
}
