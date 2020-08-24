import { StatusBar } from "expo-status-bar";
import React, { FunctionComponent } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import StorybookUIRoot from "./storybook/index";

import StatusBarBackground from "./src/shared/components/StatusBarBackground";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Account } from "./src/modules/account/Account";
import { InitializeEmail } from "./src/modules/account/InitializeEmail";
import { Login } from "./src/modules/account/Login";
import { Signup } from "./src/modules/account/Signup";
import { CertifyEmail } from "./src/modules/account/components/CertifyEmail";

import { Kyc } from "./src/modules/kyc/Kyc";
import { StartKYC } from "./src/modules/kyc/StartKYC";
import { SelectID } from "./src/modules/kyc/SelectID";
import { TakeSelfieBefore } from "./src/modules/kyc/TakeSelfieBefore";
import { PersonalDataInput } from "./src/modules/kyc/PersonalDataInput";
import { TakeID } from "./src/modules/kyc/TakeID";

import { Info } from "./src/modules/info/Info";

import { Filter } from "./src/modules/products/Filter";

// import I18n from "./src/i18n/I18n";
import "./src/i18n/i18n";
import { MainList } from "./src/modules/products/MainList";

const STORYBOOK_START = false;

export const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBarBackground />
        <StatusBar style="auto" />
        {STORYBOOK_START ? <StorybookUIRoot /> : <Kyc />}
        {/* <MyTabs /> */}
      </View>
    </NavigationContainer>
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

// const AccountNavigator = createStackNavigator({
//   InitializeEmail: InitializeEmail,
//   Login: Login,
//   CertifyEmail: CertifyEmail,
//   Signup: Signup,
// });

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <View style={{ width: "100%", position: "absolute", bottom: 0 }}>
      <Tab.Navigator>
        <Tab.Screen name="Test" component={Kyc} />
        <Tab.Screen name="Info" component={Info} />
      </Tab.Navigator>
    </View>
  );
}

export default App;
