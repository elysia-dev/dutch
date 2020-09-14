import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import styled from "styled-components/native";
import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import Api, { UserResponse } from "../../api/account";
import { Api as HistoryApi } from "../../api/info";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DashboardPage, InfoPage, AccountPage } from "../../enums/pageEnum";
import { OwnershipItem } from "../info/components/OwnershipItem";
import { Dashboard } from "./Dashboard";
import { OwnershipResponse } from "../../api/info";
import { KycStatus } from "../../enums/status";

const H1Text = styled.Text`
  color: #1c1c1c;
  margin-bottom: 15px;
  text-align: left;
  font-size: 20px;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;
const GText = styled.Text`
  color: #626368;
  font-size: 12px;
  text-align: left;
  font-weight: 300;
`;
const TotalText = styled.Text`
  color: #2c6190;
  font-size: 40px;
  text-align: center;
  margin-top: 38px;
  font-weight: bold;
`;
const AverageText = styled.Text`
  color: #1c1c1c;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
`;
const Item = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const moreHistory = (handler: () => void) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        marginTop: 30,
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
        height: 40,
        backgroundColor: "#F6F6F8",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#D0D8DF",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: "#1C1C1C",
          textAlign: "center",
        }}
      >
        {i18n.t("dashboard_label.more_history") + " >"}
      </Text>
    </TouchableOpacity>
  );
};

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  user: UserResponse;
  ownership: Array<OwnershipResponse>;
}

export class Main extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      user: {
        email: "",
        kycStatus: KycStatus.NONE,
        gender: "",
        firstName: "",
        lastName: "",
        dashboard: {
          userId: 0,
          summary: {
            properties: {
              el: "",
              btc: "",
              paypal: "",
              eth: "",
              totalProperties: "",
            },
            profits: {
              returnOnSale: "",
              returnOnRent: "",
              returnOfMonth: "",
              totalReturnOnSale: "",
              totalReturnOnRent: "",
              totalOwnedToken: "",
            },
          },
        },
      },
      ownership: [],
    };
  }

  callApi() {
    const { navigation } = this.props;

    Api.me()
      .then((res) => {
        this.setState({ user: res.data });
        console.log(this.state.user);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          alert(i18n.t("checking_account.need_login"));
          navigation.navigate(AccountPage.InitializeEmail);
        } else if (e.response.status === 500) {
          alert(i18n.t("errors.messages.server"));
        }
      });
  }

  callHistoryApi() {
    const { navigation } = this.props;

    HistoryApi.OwnershipHistory("active")
      .then((res) => {
        this.setState({ ownership: res.data });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          alert(i18n.t("checking_account.need_login"));
          navigation.navigate(AccountPage.InitializeEmail);
        } else if (e.response.status === 500) {
          alert(i18n.t("errors.messages.server"));
        }
      });
  }

  componentDidMount() {
    this.callApi();
    // this.callHistoryApi();
  }

  render() {
    const { route, navigation } = this.props;
    // const listToShow = this.state.ownership.map((item, index) => (
    //   //나중에 touchaleopacity로 감싸서 productList[index]를 params로 상세페이지 연결
    //   <OwnershipItem
    //     name={item.product.title}
    //     rate={item.product.data.expectedAnnualReturn}
    //     expectedSale={item.product.data.returnOnSale}
    //   />
    // ));

    return (
      // <ScrollView>
      <ScrollView
        style={{
          width: "100%",
          height: "100%",
          top: 0,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#2C6190",
            width: "100%",
            height: 1000,
            top: -1000,
          }}
        />
        <View
          style={{
            backgroundColor: "#2C6190",
            height: 236,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            width: "100%",
            position: "absolute",
            top: 0,
          }}
        ></View>
        <View
          style={{
            backgroundColor: "#fff",
            height: 175,
            width: "90%",
            left: "5%",
            borderRadius: 10,
            top: 110,
            shadowOffset: { width: 0, height: 0 },
            shadowColor: "#00000033",
            shadowOpacity: 0.8,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <TotalText>{"123,000$"}</TotalText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Dashboard", {
                screen: DashboardPage.TotalValue,
                params: { user: this.state.user },
              });
            }}
          >
            <PText>{i18n.t("dashboard_label.total_value") + " >"}</PText>
          </TouchableOpacity>
          <View
            style={{
              borderColor: "#D0D8DF",
              borderTopWidth: 1,
              width: "100%",
              height: 0,
              position: "absolute",
              top: 125.5,
            }}
          ></View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Dashboard", {
                screen: DashboardPage.AverageProfit,
                params: {
                  user: this.state.user,
                },
              })
            }
            style={{ elevation: 5 }}
          >
            <View
              style={{
                flexDirection: "row",
                marginLeft: "15%",
                width: "70%",
                height: 50,
                justifyContent: "space-between",
                alignContent: "center",
                top: 15,
              }}
            >
              <PText>{i18n.t("dashboard_label.average_profit")}</PText>
              <AverageText>{`${parseFloat(
                this.state.user.dashboard.summary.profits.returnOnRent
              ) +
                parseFloat(
                  this.state.user.dashboard.summary.profits.returnOnSale
                )}%`}</AverageText>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            borderColor: "#F6F6F8",
          }}
        ></View>
        <View
          style={{
            marginTop: 130,
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <H1Text>{i18n.t("dashboard_label.my_investment")}</H1Text>
          <OwnershipItem
            name={"Asset #1"}
            rate={"4.02"}
            expectedSale={"15.00"}
          />
          <OwnershipItem
            name={"Asset #1"}
            rate={"4.02"}
            expectedSale={"15.00"}
          />
          <OwnershipItem
            name={"Asset #1"}
            rate={"4.02"}
            expectedSale={"15.00"}
          />
          <View style={{ marginBottom: 20 }}>
            {moreHistory(() =>
              navigation.navigate("Info", { screen: InfoPage.OwnershipHistory })
            )}
          </View>
        </View>
        {/* </View> */}
      </ScrollView>
    );
  }
}
