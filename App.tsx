import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import StorybookUIRoot from "./storybook/index";
import { Account } from "./src/modules/account/Account";

const STORYBOOK_START = false;

export const App = () => {
  return (
    <View style={styles.container}>
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
