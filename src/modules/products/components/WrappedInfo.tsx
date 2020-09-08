import React, { Component, FunctionComponent } from "react";
import { View, Dimensions, TouchableOpacity, Text, Image } from "react-native";
import latlon from "../latlon";
import i18n from "../../../i18n/i18n";
import styled from "styled-components/native";

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

interface state {
  financial: boolean;
  highlight: boolean;
  abstract: boolean;
}

interface props {
  product: {
    data: {
      address: string;
      pricePerTokenUSD: number;
      images: [];
      financials: {
        expectedAnnualReturn: string;
        returnOnRent: string;
        returnOnSale: string;
        monthlyRentIncomeDistributionCycle: string;
        lockupPeriod: string;
        expectedSaleDate: string;
        propertyPriceUSD: string;
        propertyPriceKRW: string;
        netDepositUSD: string;
        netDepositKRW: string;
        netRentPerYearUSD: string;
        netRentPerYearKRW: string;
        bankLoan: string;
      };
      propertyHighlightes: {
        propertyType: string;
        Ground: string;
        Underground: string;
        Bedroom: string;
        buldingCompletionDate: string;
        totalParkingAvailable: string;
        airConditioning: string;
        heating: string;
        securityFacilities: string;
      };
    };
  };
}

export class WrappedInfo extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { financial: false, highlight: false, abstract: false };
  }

  render() {
    return (
      <View
        style={{
          padding: 20,
          borderBottomColor: "#F6F6F8",
          borderBottomWidth: 5,
        }}
      >
        <H1Text>{i18n.t("product_label.property_info")}</H1Text>
        <View style={{ position: "relative", marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => this.setState({ financial: !this.state.financial })}
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
                      { rotate: this.state.financial ? "180deg" : "0deg" },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          {this.state.financial && (
            <View style={{ paddingBottom: 20 }}>
              <DesView>
                <GText>
                  {i18n.t("product_financial.expected_annual_return")}
                </GText>
                <PText>{`${this.props.product.data.financials.expectedAnnualReturn}%`}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.return_rent")}</GText>
                <PText>{`${this.props.product.data.financials.returnOnRent}%`}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.return_sale")}</GText>
                <PText>{`${this.props.product.data.financials.returnOnSale}%`}</PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.rent_distribution")}</GText>
                <PText>
                  {i18n.t(
                    `product_financial.${this.props.product.data.financials.monthlyRentIncomeDistributionCycle}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.lockup_period")}</GText>
                <PText>
                  {i18n.t(
                    `product_financial.${this.props.product.data.financials.lockupPeriod}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.expected_sale_date")}</GText>
                <PText>
                  {i18n.t(
                    `product_financial.${this.props.product.data.financials.expectedSaleDate}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.price_USD")}</GText>
                <PText>
                  {`${this.props.product.data.financials.propertyPriceUSD}$`}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.price_KRW")}</GText>
                <PText>
                  {`${this.props.product.data.financials.propertyPriceKRW}₩`}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.net_deposit_USD")}</GText>
                <PText>
                  {`${this.props.product.data.financials.netDepositUSD}$`}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.net_deposit_KRW")}</GText>
                <PText>
                  {`${this.props.product.data.financials.netDepositKRW}₩`}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.net_rent_year_USD")}</GText>
                <PText>
                  {`${this.props.product.data.financials.netRentPerYearUSD}$`}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.net_rent_year_KRW")}</GText>
                <PText>
                  {`${this.props.product.data.financials.netRentPerYearKRW}₩`}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_financial.bankloan")}</GText>
                <PText>
                  {`${this.props.product.data.financials.bankLoan}`}
                </PText>
              </DesView>
            </View>
          )}
        </View>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={() => this.setState({ highlight: !this.state.highlight })}
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
                      { rotate: this.state.highlight ? "180deg" : "0deg" },
                    ],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          {this.state.highlight && (
            <View style={{ paddingBottom: 20 }}>
              <DesView>
                <GText>{i18n.t("product_highlight.type")}</GText>
                <PText>
                  {i18n.t(
                    `product_highlight.${this.props.product.data.propertyHighlightes.propertyType}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.ground")}</GText>
                <PText>
                  {i18n.t(
                    `product_highlight.${this.props.product.data.propertyHighlightes.Ground}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.underground")}</GText>
                <PText>
                  {i18n.t(
                    `product_highlight.${this.props.product.data.propertyHighlightes.Underground}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.bedroom")}</GText>
                <PText>
                  {i18n.t(
                    `product_highlight.${this.props.product.data.propertyHighlightes.Bedroom}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.completion_date")}</GText>
                <PText>
                  {
                    this.props.product.data.propertyHighlightes
                      .buldingCompletionDate
                  }
                </PText>
              </DesView>
              <DesView>
                <GText>
                  {i18n.t("product_highlight.total_parking_available")}
                </GText>
                <PText>
                  {
                    this.props.product.data.propertyHighlightes
                      .totalParkingAvailable
                  }
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.air_conditioning")}</GText>
                <PText>
                  {i18n.t(
                    `product_highlight.${this.props.product.data.propertyHighlightes.airConditioning}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.heating")}</GText>
                <PText>
                  {i18n.t(
                    `product_highlight.${this.props.product.data.propertyHighlightes.heating}`
                  )}
                </PText>
              </DesView>
              <DesView>
                <GText>{i18n.t("product_highlight.security_facilities")}</GText>
                <PText>
                  {i18n.t(
                    `product_highlight.${this.props.product.data.propertyHighlightes.securityFacilities}`
                  )}
                </PText>
              </DesView>
            </View>
          )}
        </View>
      </View>
    );
  }
}
