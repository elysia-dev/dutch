import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Image } from "react-native";
import StorybookUIRoot from "./storybook/index";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-community/async-storage";

import { Kyc } from "./src/modules/kyc/Kyc";
import { Info } from "./src/modules/info/Info";
import { Products } from "./src/modules/products/Products";
import Account from "./src/modules/account/Account";

import styled from "styled-components/native";

import ChartPng from "./assets/chart.png";
import ChartBlackPng from "./assets/chart_black.png";
import OptionsPng from "./assets/options.png";
import OptionsBlackPng from "./assets/options_black.png";
import SectionsPng from "./assets/sections.png";
import SectionsBlackPng from "./assets/sections_black.png";
import WalletPng from "./assets/wallet.png";
import WalletBlackPng from "./assets/wallet_black.png";

import UserContext from "./src/contexts/UserContext";
import { KycStatus } from "./src/enums/status";
import Api from "./src/api/account";
import LocaleType from "./src/enums/LocaleType";
import currentLocale from "./src/utiles/currentLocale";
import { Dashboard } from "./src/modules/dashboard/Dashboard";

const STORYBOOK_START = false;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
`;

interface AppState {
  signedIn: boolean;
  locale: LocaleType;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: KycStatus;
    gender: string;
  };
}

const defaultState = {
  signedIn: false,
  locale: currentLocale(),
  user: {
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    kycStatus: KycStatus.NONE,
  },
};

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  async componentDidMount() {
    await this.signIn();
  }

  signIn = async () => {
    await Api.me()
      .then((res) => {
        this.setState({
          signedIn: true,
          user: res.data,
        });
      })
      .catch(() => {
        this.setState(defaultState);
      });
  };

  signOut = async () => {
    await AsyncStorage.removeItem("@token");
    this.setState(defaultState);
  };

  render() {
    return (
      <NavigationContainer>
        <UserContext.Provider
          value={{
            ...this.state,
            signIn: this.signIn,
            signOut: this.signOut,
          }}
        >
          {STORYBOOK_START && <StorybookUIRoot />}
          <RootStack.Navigator headerMode="none">
            {this.state.signedIn ? (
              <>
                <RootStack.Screen name={"Main"} component={TabNavigatior} />
                {this.state.user.kycStatus === KycStatus.NONE && <RootStack.Screen name={"Kyc"} component={Kyc} />}
              </>
            ) : (
                <>
                  <RootStack.Screen name={"Account"} component={Account} />
                </>
              )}
          </RootStack.Navigator>
        </UserContext.Provider>
      </NavigationContainer>
    );
  }
}

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const TabNavigatior = () => {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
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
