import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import StorybookUIRoot from "./storybook/index";
import { Account } from "./src/modules/account/Account";
import StatusBarBackground from "./src/shared/components/StatusBarBackground";

const STORYBOOK_START = false;

export const App = () => {
  return (
    <View style={styles.container}>
      <StatusBarBackground />
      <StatusBar style="auto" />
      {/* {STORYBOOK_START && <StorybookUIRoot />} */}
      {STORYBOOK_START ? <StorybookUIRoot /> : <Account />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
