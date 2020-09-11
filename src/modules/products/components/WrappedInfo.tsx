import React, { FunctionComponent, useContext, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import i18n from "../../../i18n/i18n";
import styled from "styled-components/native";
import Product from "../../../types/product";
import UserContext from "../../../contexts/UserContext";
import LocaleType from "../../../enums/LocaleType";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  z-index: 3;
  margin-bottom: 15px;
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

interface props {
  product: Product;
}

const WrappedInfo: FunctionComponent<props> = (props: props) => {
  const [state, setState] = useState({
    financial: false,
    highlight: false,
    abstract: false,
  });

  const { locale } = useContext(UserContext);
  const product = props.product;
  // TODO : Add null guard languages & descrptions
  const productDescription =
    product.data.descriptions[
    product.data.languages.includes(locale) ? locale : LocaleType.EN
    ];

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          padding: 20,
          borderBottomColor: "#F6F6F8",
          borderBottomWidth: 5,
        }}
      >
        <H1Text>{i18n.t("product_label.property_info")}</H1Text>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => setState({ ...state, financial: !state.financial })}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <MText>{i18n.t("product_label.financials")}</MText>
              <Image
                source={require("../images/downbutton.png")}
                style={[
                  {
                    width: 20,
                    height: 17,
                    resizeMode: "center",
                  },
                  {
                    transform: [
                      { rotate: state.financial ? "180deg" : "0deg" },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          {state.financial && (
            <View style={{ paddingBottom: 20 }}>
              <DesView>
                <GText>
                  {i18n.t("product_financial.expected_annual_return")}
                </GText>
                <PText>{`${props.product.data.expectedAnnualReturn}%`}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.return_rent")}</GText>
                <PText>{`${props.product.data.returnOnRent}%`}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.return_sale")}</GText>
                <PText>{`${props.product.data.returnOnSale}%`}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.rent_distribution")}</GText>
                <PText>
                  {productDescription.monthlyRentIncomeDistributionCycle}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.lockup_period")}</GText>
                <PText>{productDescription.lockupPeriod}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.expected_sale_date")}</GText>
                <PText>{productDescription.expectedSaleDate}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.price")}</GText>
                <PText>{`${product.data.propertyPrice}$`}</PText>
              </DesView>

              <DesView>
                <GText>{i18n.t("product_financial.net_deposit")}</GText>
                <PText>{`${product.data.netDeposit}$`}</PText>
              </DesView>

              <DesView>
                <GText>{i18n.t("product_financial.net_rent_year")}</GText>
                <PText>{`${product.data.netRentPerYear}$`}</PText>
              </DesView>

              <DesView>
                <GText>{i18n.t("product_financial.bankloan")}</GText>
                <PText>{`${product.data.bankLoan}`}</PText>
              </DesView>
            </View>
          )}
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setState({ ...state, highlight: !state.highlight })}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <MText>{i18n.t("product_label.property_highlightes")}</MText>
              <Image
                source={require("../images/downbutton.png")}
                style={[
                  {
                    width: 20,
                    height: 17,
                    resizeMode: "center",
                  },
                  {
                    transform: [
                      { rotate: state.highlight ? "180deg" : "0deg" },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          {state.highlight && (
            <View style={{ paddingBottom: 20 }}>
              <DesView>
                <GText>{i18n.t("product_highlight.type")}</GText>
                <PText>{productDescription.propertyType}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.ground")}</GText>
                <PText>{productDescription.ground}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.underground")}</GText>
                <PText>{productDescription.underground}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.bedroom")}</GText>
                <PText>{productDescription.bedroom}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.completion_date")}</GText>
                <PText>{product.data.buildingCompletionDate}</PText>
              </DesView>
              <DesView>
                <GText>
                  {i18n.t("product_highlight.total_parking_available")}
                </GText>
                <PText>{productDescription.totalParkingAvailable}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.air_conditioning")}</GText>
                <PText>{productDescription.airConditioning}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.heating")}</GText>
                <PText>{productDescription.heating}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.security_facilities")}</GText>
                <PText>{productDescription.securityFacilities}</PText>
              </DesView>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          padding: 20,
          borderBottomColor: "#F6F6F8",
          borderBottomWidth: 5,
        }}
      >
        <H1Text>{i18n.t("product_label.product_info")}</H1Text>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => setState({ ...state, abstract: !state.abstract })}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <MText>{i18n.t("product_label.abstract")}</MText>
              <Image
                source={require("../images/downbutton.png")}
                style={[
                  {
                    width: 20,
                    height: 17,
                    resizeMode: "center",
                  },
                  {
                    transform: [{ rotate: state.abstract ? "180deg" : "0deg" }],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
        {state.abstract && (
          <View>
            <PText>{productDescription.summary}</PText>
          </View>
        )}
      </View>
    </View>
  );
};

export default WrappedInfo;
