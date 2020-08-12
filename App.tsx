import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import StorybookUIRoot from './storybook/index';

const STORYBOOK_START = true;

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      { STORYBOOK_START && <StorybookUIRoot />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;