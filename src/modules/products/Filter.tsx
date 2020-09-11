import React, { Component, FunctionComponent, Props } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { ShortOptionButton } from "./components/ShortOptionButton";
import { PaymentButton } from "./components/PaymentButton";
import PaypalGrayPng from "./images/paypal_gray.png";
import ArchwayGrayPng from "./images/archway_gray.png";
import EthereumGrayPng from "./images/ethereum_gray.png";
import ElysiaGrayPng from "./images/elysia_gray.png";

import PaypalPng from "./images/paypal.png";
import ArchwayPng from "./images/archway.png";
import EthereumPng from "./images/ethereum.png";
import ElysiaPng from "./images/elysia.png";

import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { ProductPage } from "../../enums/pageEnum";

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 25px auto;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #626368;
  text-align: left;
  margin: 5px auto 32px auto;
  width: 90%;
`;
const InputHeaderText = styled.Text`
  color: #a7a7a7;
  margin: 5px 20px;
  font-size: 12px;
  text-align: left;
`;
const Payment = styled.Image`
  width: 27px;
  height: 27px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  nation: string;
  paypal: string;
  btc: string;
  el: string;
  eth: string;
}

export class Filter extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      nation: "",
      paypal: "",
      btc: "",
      el: "",
      eth: "",
    };
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(text: string) {
    this.state.nation != text
      ? this.setState({ nation: text })
      : this.setState({ nation: "" });
  }

  render() {
    const { navigation, route } = this.props;
    const { setPayments } = route.params;
    const methods = [
      this.state.paypal,
      this.state.btc,
      this.state.el,
      this.state.eth,
    ];
    const filtered = methods.filter((method) => {
      return method != "";
    });
    const methodsToSend = filtered.toString();
    return (
      <View style={{ backgroundColor: "#fff", height: "100%" }}>
        <BackButton handler={() => navigation.goBack()} />
        <H1Text>{i18n.t("product.filter_text")}</H1Text>
        <InputHeaderText>
          {i18n.t("product_label.select_nationality")}
        </InputHeaderText>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <ShortOptionButton
            title={i18n.t("product_label.korean")}
            check={this.state.nation === "korean" ? "checked" : ""}
            handler={() => this.setFilter("korean")}
          />
          <ShortOptionButton
            title={i18n.t("product_label.foreigner")}
            check={this.state.nation === "foreigner" ? "checked" : ""}
            handler={() => this.setFilter("foreigner")}
          />
        </View>
        <InputHeaderText>
          {i18n.t("product_label.select_payment")}
        </InputHeaderText>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <PaymentButton
            child={<Payment source={PaypalGrayPng} />}
            checked_child={<Payment source={PaypalPng} />}
            check={this.state.paypal !== ""}
            handler={() =>
              this.setState({
                paypal: this.state.paypal !== "paypal" ? "paypal" : "",
              })
            }
          />
          <PaymentButton
            child={<Payment source={ArchwayGrayPng} />}
            checked_child={<Payment source={ArchwayPng} />}
            check={this.state.btc !== ""}
            handler={() =>
              this.setState({
                btc: this.state.btc !== "btc" ? "btc" : "",
              })
            }
          />
          <PaymentButton
            child={<Payment source={ElysiaGrayPng} />}
            checked_child={<Payment source={ElysiaPng} />}
            check={this.state.el !== ""}
            handler={() =>
              this.setState({
                el: this.state.el !== "el" ? "el" : "",
              })
            }
          />
          <PaymentButton
            child={<Payment source={EthereumGrayPng} />}
            checked_child={<Payment source={EthereumPng} />}
            check={this.state.eth !== ""}
            handler={() =>
              this.setState({
                eth: this.state.eth !== "eth" ? "eth" : "",
              })
            }
          />
        </View>
        <SubmitButton
          //   style={{ backgroundColor: "#fff" }}
          title={i18n.t("product_label.set_again")}
          handler={() =>
            this.setState({
              nation: "",
              paypal: "",
              btc: "",
              el: "",
              eth: "",
            })
          }
        />
        <SubmitButton
          title={i18n.t("product_label.set_filter")}
          handler={() => {
            setPayments(methodsToSend);
            navigation.navigate("Main", { screen: ProductPage.MainList });
          }}
        />
      </View>
    );
  }
}
