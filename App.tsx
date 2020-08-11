import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StorybookUIRoot from "./storybook/index";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Account } from "./src/modules/account/Account";
import { InitializeEmail } from "./src/modules/account/InitializeEmail";
import { Login } from "./src/modules/account/Login";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.tsx to start working on your app!</Text> */}
      <StatusBar style="auto" />
      <StorybookUIRoot />
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

// export default from './storybook';

// import StorybookUIRoot from "./storybook";
// export default from './storybook';

// const App = createStackNavigator(
//   {
//     Account: { screen: Account },
//     InitializeEmail: { screen: InitializeEmail },
//     Login: { screen: Login },
//   },
//   { initialRouteName: "Account", headerMode: "none" }
// );

// export default createAppContainer(App);
