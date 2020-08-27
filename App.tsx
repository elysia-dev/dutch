import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Image } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import StorybookUIRoot from "./storybook/index";
import StatusBarBackground from "./src/shared/components/StatusBarBackground";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { Kyc } from "./src/modules/kyc/Kyc";
import { Info } from "./src/modules/info/Info";
import { Products } from "./src/modules/products/Products";
import { Account } from "./src/modules/account/Account";

import styled from "styled-components/native";

import ChartPng from "./assets/chart.png";
import ChartBlackPng from "./assets/chart_black.png";
import ElysiaPng from "./assets/elysia.png";
import ElysiaBlackPng from "./assets/elysia_black.png";
import OptionsPng from "./assets/options.png";
import OptionsBlackPng from "./assets/options_black.png";
import SectionsPng from "./assets/sections.png";
import SectionsBlackPng from "./assets/sections_black.png";
import WalletPng from "./assets/wallet.png";
import WalletBlackPng from "./assets/wallet_black.png";

import { UserProvider } from "./src/contexts/userInfo";

const STORYBOOK_START = false;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
`;

//local storage에서 token 확인하는 로직

export const App = () => {
  return (
    <NavigationContainer>
      <UserProvider>
        <StatusBarBackground />
        <StatusBar style="auto" />
        {STORYBOOK_START && <StorybookUIRoot />}
        <RootStack.Navigator initialRouteName={"Main"} headerMode="none">
          <RootStack.Screen name={"Account"} component={Account} />
          <RootStack.Screen name={"Main"} component={TabNavigatior} />
          <RootStack.Screen name={"Kyc"} component={Kyc} />
        </RootStack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

const RootStack = createStackNavigator();

// const Root = () => {
//   return (
//     <RootStack.Navigator initialRouteName={"Account"} headerMode="none">
//       <RootStack.Screen name={"Account"} component={Account} />
//       <RootStack.Screen name={"Main"} component={TabNavigatior} />
//       <RootStack.Screen name={"Kyc"} component={Kyc} />
//     </RootStack.Navigator>
//   );
// };

const Tab = createBottomTabNavigator();

const TabNavigatior = () => {
  return (
    <Tab.Navigator initialRouteName="Product">
      <Tab.Screen
        name="Product12"
        component={Products}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Icon source={focused ? ChartBlackPng : ChartPng} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={Products}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Icon source={focused ? SectionsBlackPng : SectionsPng} />
          ),
        }}
      />
      <Tab.Screen
        name="Products1"
        component={Products}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                resizeMode: "center",
                height: 26,
                width: 26,
              }}
              source={focused ? WalletBlackPng : WalletPng}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Products2"
        component={Products}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                resizeMode: "center",
                height: 26,
                width: 26,
              }}
              source={focused ? ElysiaBlackPng : ElysiaPng}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={Info}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                resizeMode: "center",
                height: 25,
                width: 25,
              }}
              source={focused ? OptionsBlackPng : OptionsPng}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
