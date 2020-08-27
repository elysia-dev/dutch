import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/kyc";

const H1Text = styled.Text`
  color: #000;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
  margin-top: 40px;
  margin-left: 30px;
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

const HOC = (text: string) => {
  return <Text>{text}</Text>;
};

export class Info extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {};
  }

  Email = Api.getEmail;

  render() {
    const { route, navigation } = this.props;
    // const { email, password } = route.params;
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          height: "100%",
          flex: 1,
        }}
      >
        <View
          style={{
            width: "100%",
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
            height: "15%",
          }}
        >
          <H1Text>{this.Email}</H1Text>
          {/* <HOC text={this.Email} /> */}
        </View>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <SubmitButton
            title={i18n.t("info_label.need_kyc")}
            handler={() => navigation.navigate("Kyc")}
          />
        </View>
      </View>
    );
  }
}
