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
import { DateInput } from "./components/DateInput";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 25px;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  all: string;
  deposit: string;
  withdraw: string;
  el: string;
  paypal: string;
  eth: string;
  btc: string;
}

const filterButton = (state: boolean, handler: () => void, title: string) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        width: "100%",
        height: 35,
        backgroundColor: state ? "#64B6F4" : "#E6ECF2",
        borderRadius: 5,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text
        style={{
          color: state ? "#FFFFFF" : "#5C5B5B",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const submitButton = (title: string, handler: () => void) => {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: 40,
        backgroundColor: "#2C6190",
        borderRadius: 5,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text
        style={{
          color: "#F5F5F5",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export class TransactionHistory extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      all: "",
      deposit: "",
      withdraw: "",
      el: "",
      paypal: "",
      eth: "",
      btc: "",
    };
  }

  render() {
    const { navigation, route } = this.props;

    const methods = [
      this.state.paypal,
      this.state.btc,
      this.state.el,
      this.state.eth,
    ];

    const methodToSend = methods.filter((method) => {
      return method !== "";
    });

    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          height: "100%",
          padding: 20,
        }}
      >
        <BackButton handler={() => navigation.goBack()}></BackButton>
        <H1Text>{i18n.t("info_label.transaction_history")}</H1Text>
        <PText>{i18n.t("info_label.transaction_term")}</PText>
        <View style={{ marginBottom: 15 }}>
          <DateInput eventHandler={() => {}} />
        </View>
        <PText>{i18n.t("info_label.transaction_log")}</PText>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <View style={{ width: "30%" }}>
            {filterButton(
              this.state.all === "all",
              () =>
                this.setState({
                  all: this.state.all !== "all" ? "all" : "",
                  deposit: "",
                  withdraw: "",
                }),
              i18n.t("info_label.all")
            )}
          </View>
          <View style={{ width: "30%" }}>
            {filterButton(
              this.state.deposit === "deposit",
              () =>
                this.setState({
                  deposit: this.state.deposit !== "deposit" ? "deposit" : "",
                  all: "",
                  withdraw: "",
                }),
              i18n.t("info_label.deposit")
            )}
          </View>
          <View style={{ width: "30%" }}>
            {filterButton(
              this.state.withdraw === "withdraw",
              () =>
                this.setState({
                  withdraw:
                    this.state.withdraw !== "withdraw" ? "withdraw" : "",
                  all: "",
                  deposit: "",
                }),
              i18n.t("info_label.withdraw")
            )}
          </View>
        </View>

        <PText>{i18n.t("info_label.transaction_method")}</PText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <View style={{ width: "22.5%" }}>
            {filterButton(
              this.state.paypal === "paypal",
              () =>
                this.setState({
                  paypal: this.state.paypal !== "paypal" ? "paypal" : "",
                }),
              "PAYPAL"
            )}
          </View>
          <View style={{ width: "22.5%" }}>
            {filterButton(
              this.state.btc === "btc",
              () =>
                this.setState({
                  btc: this.state.btc !== "btc" ? "btc" : "",
                }),
              "BTC"
            )}
          </View>
          <View style={{ width: "22.5%" }}>
            {filterButton(
              this.state.el === "el",
              () =>
                this.setState({
                  el: this.state.el !== "el" ? "el" : "",
                }),
              "EL"
            )}
          </View>
          <View style={{ width: "22.5%" }}>
            {filterButton(
              this.state.eth === "eth",
              () =>
                this.setState({
                  eth: this.state.eth !== "eth" ? "eth" : "",
                }),
              "ETH"
            )}
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginBottom: 15,
            marginTop: 20,
          }}
        >
          {submitButton("검색하기", () => {})}
        </View>
      </View>
    );
  }
}
