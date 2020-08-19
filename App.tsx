import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import StorybookUIRoot from "./storybook/index";
import { Account } from "./src/modules/account/Account";
import StatusBarBackground from "./src/shared/components/StatusBarBackground";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { InitializeEmail } from "./src/modules/account/InitializeEmail";
import { Login } from "./src/modules/account/Login";
import { Signup } from "./src/modules/account/Signup";
import { CertifyEmail } from "./src/modules/account/components/CertifyEmail";

// import I18n from "./src/i18n/I18n";
import "./src/i18n/i18n";

const STORYBOOK_START = true;

export const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBarBackground />
        <StatusBar style="auto" />
        {/* {STORYBOOK_START && <StorybookUIRoot />} */}
        {STORYBOOK_START ? <StorybookUIRoot /> : <Account />}
      </View>
    </NavigationContainer>
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

const AccountNavigator = createStackNavigator({
  InitializeEmail: InitializeEmail,
  Login: Login,
  CertifyEmail: CertifyEmail,
  Signup: Signup,
});

// const Tab = createBottomTabNavigator();

// export default function TabNavigator() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={} />
//         <Tab.Screen name="Settings" component={} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

export default App;
