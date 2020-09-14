import React, { Component, FunctionComponent } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import FilterPng from "./images/filter.png";
import { SortingButton } from "./components/SortingButton";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import { ProductPage } from "../../enums/pageEnum";
import Api from "../../api/product";
import { Item } from "./components/Item";
import Product from "../../types/product";

const FilterImg = styled.Image`
  width: 12px;
  height: 12px;
  top: 8px;
  margin: 2px 3px;
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
  line-height: 30px;
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
  productList: Product[];
}

export class MainList extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      return: false,
      popularity: false,
      payments: "",
      productList: [],
    };
    this.setPayments = this.setPayments.bind(this);
  }

  setPayments(input: string) {
    this.setState({ payments: input });
  }

  callApi() {
    const { navigation, route } = this.props;

    Api.products(
      this.state.payments === "" ? "paypal,btc,el,eth" : this.state.payments,
      this.state.return ? "expectedAnnualReturn" : "createdAt"
    )
      .then((res) => {
        this.setState({ productList: res.data });
        console.log(this.state.productList);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          alert(i18n.t("checking_account.need_login"));
          navigation.navigate("Account");
        } else if (e.response.status === 500) {
          alert(i18n.t("errors.server.duplicate_email"));
        }
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
    const listToShow = this.state.productList.map((product, index) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Product", {
            screen: ProductPage.ProductInfo,
            params: {
              product: this.state.productList[index],
            },
          })
        }
        key={`item-${index}`}
      >
        <Item annualReturn={product.data.expectedAnnualReturn} />
      </TouchableOpacity>
    ));
    return (
      <View style={{ height: "100%" }}>
        <ScrollView scrollEnabled={true}>
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
              height: 155,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              width: "100%",
              position: "absolute",
              top: 0,
            }}
          />
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
                navigation.navigate("Product", {
                  screen: ProductPage.Filter,
                  params: {
                    setPayments: this.setPayments,
                  },
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
          <View style={{ marginTop: 155 }}>{listToShow}</View>
        </ScrollView>
      </View>
    );
  }
}
