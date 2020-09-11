import React, { FunctionComponent, useState, useContext } from "react";
import { View, ScrollView, Image, SafeAreaView } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { BackButton } from "../../shared/components/BackButton";
import { Calculator } from "./components/Calculator";
import WrappedInfo from "./components/WrappedInfo";
import Product from "../../types/product";
import UserContext from "../../contexts/UserContext";
import LocaleType from "../../enums/LocaleType";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

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

type ParamList = {
  ProductInfo: {
    product: Product;
  };
};

const ProductInfo: FunctionComponent = () => {
  const [state, setState] = useState({
    investment: 20,
    financial: false,
    highlight: false,
    abstract: false,
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "ProductInfo">>();
  const { locale } = useContext(UserContext);
  const product = route.params.product;
  const productDescription =
    product.data.descriptions[
      product.data.languages.includes(locale) ? locale : LocaleType.EN
    ];

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        flex: 1,
      }}
    >
      <ScrollView
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        style={{ flex: 1 }}
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
              height: 480,
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
              <WText>
                {i18n.strftime(
                  new Date(product.data.buildingCompletionDate),
                  "%Y-%m-%d"
                )}
              </WText>
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
              <PText>{`${product.data.expectedAnnualReturn}%`}</PText>
            </DesView>
            <DesView>
              <GText>{i18n.t("product_label.rent_distribution")}</GText>
              <PText>
                {productDescription.monthlyRentIncomeDistributionCycle}
              </PText>
            </DesView>
            <DesView>
              <GText>{i18n.t("product_label.price_per_token")}</GText>
              <PText>{`${product.data.pricePerToken} USD`}</PText>
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
            investment={state.investment}
            product={product}
            sliderHandler={(value: number) => {
              setState({ ...state, investment: value });
            }}
          />
          {/* web에서 테스트하려면 Map 주석처리해야함!! */}
          {/* <Map product={product} /> */}
          <WrappedInfo product={product} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductInfo;
