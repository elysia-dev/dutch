import React, { Component, FunctionComponent } from "react";
import { View, Dimensions, TouchableOpacity, Text, Image } from "react-native";
import latlon from "../latlon";
import i18n from "../../../i18n/i18n";
import styled from "styled-components/native";
import { ProductResponse } from "../../../api/product";

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
  product: ProductResponse;
}

export class WrappedInfo extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { financial: false, highlight: false, abstract: false };
  }

  render() {
    const currentLang = () => {
      if (i18n.currentLocale() === "ko-KR") {
        return "ko";
      } else if (i18n.currentLocale() === "zh-CN") {
        return "ch";
      } else {
        return "en";
      }
    };
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
          <View style={{ position: "relative", marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ financial: !this.state.financial })
              }
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
                  <PText>{`${this.props.product.data.expectedAnnualReturn}%`}</PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_financial.return_rent")}</GText>
                  <PText>{`${this.props.product.data.returnOnRent}%`}</PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_financial.return_sale")}</GText>
                  <PText>{`${this.props.product.data.returnOnSale}%`}</PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_financial.rent_distribution")}</GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .monthlyRentIncomeDistributionCycle
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_financial.lockup_period")}</GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .lockupPeriod
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>
                    {i18n.t("product_financial.expected_sale_date")}
                  </GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .expectedSaleDate
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_financial.price")}</GText>
                  <PText>{`${this.props.product.data.propertyPrice}$`}</PText>
                </DesView>

                <DesView>
                  <GText>{i18n.t("product_financial.net_deposit")}</GText>
                  <PText>{`${this.props.product.data.netDeposit}$`}</PText>
                </DesView>

                <DesView>
                  <GText>{i18n.t("product_financial.net_rent_year")}</GText>
                  <PText>{`${this.props.product.data.netRentPerYear}$`}</PText>
                </DesView>

                <DesView>
                  <GText>{i18n.t("product_financial.bankloan")}</GText>
                  <PText>{`${this.props.product.data.bankLoan}`}</PText>
                </DesView>
              </View>
            )}
          </View>
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ highlight: !this.state.highlight })
              }
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
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .propertyType
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_highlight.ground")}</GText>
                  <PText>
                    {this.props.product.data.descriptions[currentLang()].ground}
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_highlight.underground")}</GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .underground
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_highlight.bedroom")}</GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .bedroom
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_highlight.completion_date")}</GText>
                  <PText>
                    {this.props.product.data.buildingCompletionDate}
                  </PText>
                </DesView>
                <DesView>
                  <GText>
                    {i18n.t("product_highlight.total_parking_available")}
                  </GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .totalParkingAvailable
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_highlight.air_conditioning")}</GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .airConditioning
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>{i18n.t("product_highlight.heating")}</GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .heating
                    }
                  </PText>
                </DesView>
                <DesView>
                  <GText>
                    {i18n.t("product_highlight.security_facilities")}
                  </GText>
                  <PText>
                    {
                      this.props.product.data.descriptions[currentLang()]
                        .securityFacilities
                    }
                  </PText>
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
          <View style={{ position: "relative", marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => this.setState({ abstract: !this.state.abstract })}
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
                      transform: [
                        { rotate: this.state.abstract ? "180deg" : "0deg" },
                      ],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
          {this.state.abstract && (
            <View>
              <PText>
                {this.props.product.data.descriptions[currentLang()].summary}
              </PText>
            </View>
          )}
        </View>
      </View>
    );
  }
}
