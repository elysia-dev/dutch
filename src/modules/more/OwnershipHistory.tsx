import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { BackButton } from "../../shared/components/BackButton";
import { Api, OwnershipResponse } from "../../api/info";
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
  Active = "active",
  Deactive = "deactive",
}

export class OwnershipHistory extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { productList: [], status: Status.Active };
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
            this.state.status === Status.Active
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
    this.callApi();
    // 서버 작업 후 호출
  }

  componentDidUpdate(_prevProps: object, prevState: { status: Status }) {
    if (prevState.status !== this.state.status) this.callApi();
  }

  render() {
    const { navigation, route } = this.props;
    const listToShow = this.state.productList.map((item, index) => (
      //나중에 touchaleopacity로 감싸서 productList[index]를 params로 상세페이지 연결
      <OwnershipItem
        name={item.product.title}
        rate={item.product.data.expectedAnnualReturn}
        expectedSale={item.product.data.returnOnSale}
        key={`item-${index}`}
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
        <ScrollView>
          <BackButton
            style={{ marginBottom: 10 }}
            handler={() => {
              this.state.status === Status.Active
                ? navigation.goBack()
                : this.setState({
                    status: Status.Active,
                  });
            }}
          ></BackButton>
          <H1Text>{i18n.t("info_label.my_inv_history")}</H1Text>
          {listToShow}
          {this.state.status === Status.Active && (
            <View style={{ paddingBottom: 20 }}>
              {this.moreHistory(() => {
                this.setState({
                  status: Status.Deactive,
                });
              })}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
