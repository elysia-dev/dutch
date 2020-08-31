import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/kyc";
import { BackButton } from "../../shared/components/BackButton";
import { TouchableOpacity } from "react-native-gesture-handler";

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
  font-size: 13px;
  text-align: center;
  margin-top: 5px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {}

export class MyPage extends Component<props, state> {
  constructor(props: props) {
    super(props);
  }

  render() {
    const { route, navigation } = this.props;
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
        <BackButton
          handler={() => {
            navigation.goBack();
          }}
        />
        <H1Text>{i18n.t("info_label.my_account")}</H1Text>
        <TouchableOpacity
          onPress={() => {
            Api.logout;
            navigation.navigate("Account");
          }}
          style={{
            backgroundColor: "#E6ECF2",
            borderRadius: 5,
            width: 80,
            height: 25,
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <PText>{i18n.t("info_label.logout")}</PText>
        </TouchableOpacity>
      </View>
    );
  }
}
