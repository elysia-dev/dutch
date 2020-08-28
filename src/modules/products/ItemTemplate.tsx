import React, { Component, FunctionComponent, Props } from "react";
import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  ScrollView,
} from "react-native";
import { Item } from "./Item";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/product";

interface props {
  payments: string;
  sort: string;
}

interface state {
  productList: Array<Object>;
}

export class ItemTemplate extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { productList: [] };
  }

  componentDidMount() {
    Api.products(this.props.payments, this.props.sort)
      .then((res) => {
        console.log(res);
        this.setState({ productList: res.data });
        console.log(this.state.productList);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  //   shouldComponentUpdate(
  //     nextProps: Readonly<props> & Readonly<{ children?: React.ReactNode }>
  //   ) {
  //     return nextProps !== this.props;
  //   }

  //   componentDidUpdate() {
  //     Api.products(this.props.payments, this.props.sort)
  //       .then((res) => {
  //         console.log(res);
  //         this.setState({ productList: res.data });
  //         console.log(this.state.productList);
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //       });
  //   }

  render() {
    const listToShow = this.state.productList.map((product, index) => (
      //   <Item annualReturn={product.data.financials.expectedAnnualReturn} />
      <Item annualReturn={product.expectedAnnualReturn} />
    ));
    console.log(this.props.sort);
    return <ScrollView>{listToShow}</ScrollView>;
  }
}
