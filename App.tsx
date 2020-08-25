import { StatusBar } from "expo-status-bar";
import React, { FunctionComponent } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import StorybookUIRoot from "./storybook/index";

import StatusBarBackground from "./src/shared/components/StatusBarBackground";
import { NavigationContainer } from "@react-navigation/native";

import { Kyc } from "./src/modules/kyc/Kyc";

import { Info } from "./src/modules/info/Info";

import { Filter } from "./src/modules/products/Filter";

// import I18n from "./src/i18n/I18n";
import "./src/i18n/i18n";
import { kycNavigator } from "./src/navigator/kycNavigator";

const STORYBOOK_START = true;

export const App = () => {
  return (
    // <NavigationContainer>
    // {kycNavigator}
    <View style={styles.container}>
      <StatusBarBackground />
      <StatusBar style="auto" />
      {STORYBOOK_START ? <StorybookUIRoot /> : <Kyc />}
      {/* <MyTabs /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
