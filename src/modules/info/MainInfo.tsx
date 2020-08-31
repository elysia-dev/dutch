import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api from "../../api/kyc";
import { TouchableOpacity } from "react-native-gesture-handler";
import { InfoPage } from "../../enums/pageEnum";

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
// const NextImg = styled.Image`
// width: 5px,
// height: 8px`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {}

export class MainInfo extends Component<props, state> {
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
            height: "20%",
            // flex: 1,
            // flexDirection: "row",
          }}
        >
          <H1Text>{"email@email.com"}</H1Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(InfoPage.MyPage);
            }}
          >
            <Image
              source={require("../../../assets/setting.png")}
              style={{ width: 20, height: 20, resizeMode: "center" }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            height: "15%",
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
        <View
          style={{
            flex: 1,
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
            justifyContent: "center",
            alignContent: "flex-start",
          }}
        >
          <View>
            <H1Text>{i18n.t("info_label.confirm")}</H1Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PText>{i18n.t("info_label.investment_history")}</PText>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={require("../../../assets/next_gray.png")}
                style={{ width: 5, height: 8, resizeMode: "center" }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PText>{i18n.t("info_label.transaction_history")}</PText>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={require("../../../assets/next_gray.png")}
                style={{ width: 5, height: 8, resizeMode: "center" }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PText>{i18n.t("info_label.progress_history")}</PText>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={require("../../../assets/next_gray.png")}
                style={{ width: 5, height: 8, resizeMode: "center" }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#F6F6F8",
            borderBottomWidth: 5,
            justifyContent: "center",
            alignContent: "flex-start",
          }}
        >
          <View>
            <H1Text>{i18n.t("info_label.elysia")}</H1Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PText>{i18n.t("info_label.notice")}</PText>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={require("../../../assets/next_gray.png")}
                style={{ width: 5, height: 8, resizeMode: "center" }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PText>{i18n.t("info_label.service_terms")}</PText>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={require("../../../assets/next_gray.png")}
                style={{ width: 5, height: 8, resizeMode: "center" }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PText>{i18n.t("info_label.contact")}</PText>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={require("../../../assets/next_gray.png")}
                style={{ width: 5, height: 8, resizeMode: "center" }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PText>{i18n.t("info_label.faq")}</PText>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={require("../../../assets/next_gray.png")}
                style={{ width: 5, height: 8, resizeMode: "center" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
