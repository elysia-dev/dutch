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

interface props {}

interface state {
  nation: string;
  paypal: boolean;
  archway: boolean;
  elysia: boolean;
  ethereum: boolean;
}

export class Filter extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      nation: "",
      paypal: false,
      archway: false,
      elysia: false,
      ethereum: false,
    };
    this.setNation = this.setNation.bind(this);
  }

  setNation(text: string) {
    this.state.nation != text
      ? this.setState({ nation: text })
      : this.setState({ nation: "" });
  }

  render() {
    return (
      <View>
        <BackButton handler={() => {}} />
        <H1Text>{i18n.t("product.filter_text")}</H1Text>
        <InputHeaderText>
          {i18n.t("product_label.select_nationality")}
        </InputHeaderText>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <ShortOptionButton
            title={i18n.t("product_label.korean")}
            check={this.state.nation === "korean" ? "checked" : ""}
            handler={() => this.setNation("korean")}
          />
          <ShortOptionButton
            title={i18n.t("product_label.foreigner")}
            check={this.state.nation === "foreigner" ? "checked" : ""}
            handler={() => this.setNation("foreigner")}
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
            check={this.state.paypal}
            handler={() => this.setState({ paypal: !this.state.paypal })}
          />
          <PaymentButton
            child={<Payment source={ArchwayGrayPng} />}
            checked_child={<Payment source={ArchwayPng} />}
            check={this.state.archway}
            handler={() => this.setState({ archway: !this.state.archway })}
          />
          <PaymentButton
            child={<Payment source={ElysiaGrayPng} />}
            checked_child={<Payment source={ElysiaPng} />}
            check={this.state.elysia}
            handler={() => this.setState({ elysia: !this.state.elysia })}
          />
          <PaymentButton
            child={<Payment source={EthereumGrayPng} />}
            checked_child={<Payment source={EthereumPng} />}
            check={this.state.ethereum}
            handler={() => this.setState({ ethereum: !this.state.ethereum })}
          />
        </View>
        <SubmitButton
          //   style={{ backgroundColor: "#fff" }}
          title={i18n.t("product_label.set_again")}
          handler={() =>
            this.setState({
              nation: "",
              paypal: false,
              archway: false,
              elysia: false,
              ethereum: false,
            })
          }
        />
        <SubmitButton
          title={i18n.t("product_label.set_filter")}
          handler={() => {}}
        />
      </View>
    );
  }
}
