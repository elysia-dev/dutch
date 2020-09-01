import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/kyc";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DashboardPage } from "../../enums/pageEnum";

const H1Text = styled.Text`
  color: #000;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
  margin-top: 20px;
  margin-left: 20px;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
`;

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
      <View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          backgroundColor: "#fff",
          height: "100%",
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
        ></View>
      </View>
    );
  }
}
