import React, { Component, FunctionComponent, Props } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { ProductPage } from "../../enums/pageEnum";
import Api from "../../api/product";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { Calculator } from "./components/Calculator";
import { WrappedInfo } from "./components/WrappedInfo";
import { Map } from "./components/Map";

const WH1Text = styled.Text`
  margin-top: 14px;
  color: #fff;
  font-size: 20px;
  text-align: left;
`;
const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
`;
const WText = styled.Text`
  margin-top: 18px;
  color: #fff;
  font-size: 14px;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 12px;
  text-align: left;
  font-weight: 300;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 12px;
  font-weight: 300;
`;
const MText = styled.Text`
  color: #1c1c1c;
  font-size: 14px;
  font-weight: 300;
`;
const DesView = styled.View`
  margin-top: 18px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Method = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 14px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  investment: number;
  financial: boolean;
  highlight: boolean;
  abstract: boolean;
}

export class ProductInfo extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      investment: 20,
      financial: false,
      highlight: false,
      abstract: false,
    };
    this.setInvestment = this.setInvestment.bind(this);
  }

  setInvestment(value: number) {
    this.setState({ investment: value });
  }

  render() {
    const { navigation, route } = this.props;
    const { product } = route.params;
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#fff",
          width: "100%",
          // height: "100%",
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 0,
              height: "100%",
            }}
            scrollEnabled={true}
          >
            {/* <View style={{ position: "absolute", bottom: 100 }}>
            <SubmitButton
              title={i18n.t("product_label.invest_now")}
              handler={() => {}}
            ></SubmitButton>
          </View> */}
            <View
              style={{
                backgroundColor: "#2C6190",
                width: "100%",
                height: 243,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
            >
              <View
                style={{
                  padding: 20,
                  borderBottomColor: "#F6F6F8",
                  borderBottomWidth: 5,
                  height: 450,
                }}
              >
                <BackButton handler={() => navigation.goBack()}></BackButton>
                <View
                  style={{
                    overflow: "visible",
                    height: 30,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <WH1Text>{product.title}</WH1Text>
                  <WText>{product.createdAt}</WText>
                </View>
                <Image
                  source={{ uri: product.data.images[0] }}
                  style={{
                    top: 20,
                    width: "100%",
                    height: 200,
                    resizeMode: "cover",
                    borderRadius: 5,
                    marginBottom: 20,
                  }}
                />
                <DesView>
                  <GText>{i18n.t("product_label.expected_annual_rate")}</GText>
                  <PText>{`${product.expectedAnnualReturn}%`}</PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_label.rent_distribution")}</GText>
                  <PText>
                    {i18n.t(
                      `product_financial.${product.data.financials.monthlyRentIncomeDistributionCycle}`
                    )}
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_label.price_per_token")}</GText>
                  <PText>{`${product.data.pricePerToken ||
                    product.data.pricePerTokenUSD} USD`}</PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_label.return_method")}</GText>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    {product.allowedPayments.includes("paypal") && (
                      <Method source={require("./images/paypal.png")} />
                    )}
                    {product.allowedPayments.includes("btc") && (
                      <Method source={require("./images/archway.png")} />
                    )}
                    {product.allowedPayments.includes("el") && (
                      <Method source={require("./images/elysia.png")} />
                    )}
                    {product.allowedPayments.includes("eth") && (
                      <Method source={require("./images/ethereum.png")} />
                    )}
                  </View>
                </DesView>
              </View>
              <Calculator
                investment={this.state.investment}
                product={product}
                sliderHandler={this.setInvestment}
              />
              {/* web에서 테스트하려면 Map 주석처리해야함!! */}
              {/* <Map product={product} /> */}
              <WrappedInfo product={product} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
