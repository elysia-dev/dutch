import React, { Component, FunctionComponent, Props } from "react";
import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  ScrollView,
} from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import MailPng from "./images/mail.png";
import FilterPng from "./images/filter.png";
import { SortingButton } from "./components/SortingButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { ProductPage } from "../../enums/pageEnum";
import Api from "../../api/product";
import { Item } from "./Item";

const MailImg = styled.Image`
  width: 22px;
  height: 16px;
  top: 70px;
  left: 330px;
  position: relative;
`;
const FilterImg = styled.Image`
  width: 12px;
  height: 12px;
  position: relative;
`;
const FilterBtn = styled.TouchableOpacity`
  width: 50px;
  margin: 0 auto;
  height: 30px;
  background-color: #64b6f4;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  padding-bottom: 5px;
`;
const FilterBtnText = styled.Text`
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 40px;
  z-index: 5;
  justify-content: center;
  align-content: center;
`;

const FilterButton: FunctionComponent<{ handler: () => void }> = ({
  handler,
}) => {
  return (
    <FilterBtn onPress={handler}>
      <FilterImg source={FilterPng} />
      <FilterBtnText>{i18n.t("product_label.filter")}</FilterBtnText>
    </FilterBtn>
  );
};

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  return: boolean;
  popularity: boolean;
  payments: string;
  productList: Array<Object>;
}

export class MainList extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      return: false,
      popularity: false,
      payments: "paypal,btc,el,eth",
      productList: [],
    };
    this.setPayments = this.setPayments.bind(this);
  }

  setPayments(input: string) {
    this.setState({ payments: input });
  }

  callApi() {
    Api.products(
      this.state.payments === "" ? "paypal,btc,el,eth" : this.state.payments,
      this.state.return ? "expectedAnnualReturn" : "createdAt"
    )
      .then((res) => {
        console.log(res);
        this.setState({ productList: res.data });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  componentDidMount() {
    this.callApi();
  }

  componentDidUpdate(
    _prevProps: object,
    prevState: { return: boolean; payments: string }
  ) {
    if (
      prevState.payments !== this.state.payments ||
      prevState.return !== this.state.return
    )
      this.callApi();
  }

  render() {
    const { navigation, route } = this.props;
    const listToShow = this.state.productList.map((product, _index) => (
      <Item annualReturn={product.expectedAnnualReturn} />
    ));
    console.log(this.state.payments);
    return (
      <View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          backgroundColor: "#fff",
          height: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: "#2C6190",
            height: 155,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            width: "100%",
            position: "absolute",
            top: 0,
          }}
        >
          <MailImg source={MailPng} />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              position: "relative",
              top: 90,
              paddingLeft: 120,
              paddingRight: 16,
            }}
          >
            <FilterButton
              handler={() =>
                navigation.navigate(ProductPage.Filter, {
                  setPayments: this.setPayments,
                })
              }
            />
            <SortingButton
              title={i18n.t("product_label.sorting_return")}
              check={this.state.return}
              handler={() => {
                this.setState({
                  return: !this.state.return,
                  popularity: false,
                });
              }}
            />
            <SortingButton
              title={i18n.t("product_label.sorting_popularity")}
              check={this.state.popularity}
              handler={() => {
                this.setState({
                  popularity: !this.state.popularity,
                  return: false,
                });
              }}
            />
          </View>
        </View>
        <View style={{ position: "relative", top: 180 }}>
          <ScrollView>{listToShow}</ScrollView>
        </View>
      </View>
    );
  }
}
