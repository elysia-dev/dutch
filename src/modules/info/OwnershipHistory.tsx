import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { InfoPage } from "../../enums/pageEnum";
import { BackButton } from "../../shared/components/BackButton";
import Api, { OwnershipResponse } from "../../api/info";
import { OwnershipItem } from "./components/OwnershipItem";
import { ScrollView } from "react-native-gesture-handler";

const H1Text = styled.Text`
  color: #1c1c1c;
  font-size: 20px;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 15px;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  productList: Array<OwnershipResponse>;
  status: Status;
}
enum Status {
  Activated = "activated",
  Deactivated = "deactivated",
}

export class OwnershipHistory extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { productList: [], status: Status.Activated };
  }

  moreHistory = (handler: () => void) => {
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
          {i18n.t(
            this.state.status === Status.Activated
              ? "info_label.last_investments"
              : "info_label.current_investments"
          ) + " >"}
        </Text>
      </TouchableOpacity>
    );
  };

  callApi() {
    const { navigation } = this.props;
    Api.OwnershipHistory(this.state.status)
      .then((res) => {
        this.setState({ productList: res.data });
      })
      .catch((e) => {
        console.error(e);
        alert(i18n.t("checking_account.need_login"));
        navigation.navigate("Account");
      });
  }

  componentDidMount() {
    // this.callApi();
    // 서버 작업 후 호출
  }

  render() {
    const { navigation, route } = this.props;
    const listToShow = this.state.productList.map((item, index) => (
      //나중에 touchaleopacity로 감싸서 productList[index]를 params로 상세페이지 연결
      <OwnershipItem
        name={item.product.title}
        rate={item.product.expectedAnnualReturn}
        expectedSale={item.product.returnOnSale}
      />
    ));

    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          paddingRight: "5%",
          paddingLeft: "5%",
        }}
      >
        <BackButton
          handler={() => navigation.navigate(InfoPage.MainInfo)}
        ></BackButton>
        <H1Text>{i18n.t("info_label.my_inv_history")}</H1Text>
        {/* 이 가짜 데이터들 지우고 list 받아오기 */}
        <OwnershipItem name={"Asset #1"} rate={"4.02"} expectedSale={"15.00"} />
        <OwnershipItem name={"Asset #1"} rate={"4.02"} expectedSale={"15.00"} />
        {/* <ScrollView>{listToShow}</ScrollView> */}
        <View>
          {this.moreHistory(() => {
            this.setState({
              status:
                this.state.status === Status.Deactivated
                  ? Status.Activated
                  : Status.Deactivated,
            });
            // 지난 투자내역 불러오는 거 확인, lifecycle고려
            // 안 되면 현재/과거 state 관리 말고 직접 버튼에서 과거 투자내역 api 호출
          })}
        </View>
      </View>
    );
  }
}
