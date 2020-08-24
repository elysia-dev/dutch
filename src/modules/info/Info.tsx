import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { SubmitButton } from "../../shared/components/SubmitButton";
import i18n from "../../i18n/i18n";
// import { TabNavigator } from "../../../App";

interface props {}

interface state {}

export class Info extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {};
  }
  render() {
    return <View style={{ width: "100%" }}>{/* <TabNavigator /> */}</View>;
  }
}
