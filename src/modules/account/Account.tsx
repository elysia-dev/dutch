import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { InitializeEmail } from "./InitializeEmail";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { LockAccount } from "./LockAccount";
import { ChangePassword } from "./ChangePassword";
import { CertifyEmail } from "./components/CertifyEmail";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountPage } from "../../enums/pageEnum";

interface props {}

interface state {}

export class Account extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Stack.Navigator
        initialRouteName={AccountPage.InitializeEmail}
        headerMode="none"
      >
        <Stack.Screen
          name={AccountPage.InitializeEmail}
          component={InitializeEmail}
        />
        <Stack.Screen
          name={AccountPage.Signup}
          component={Signup}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name={AccountPage.Login} component={Login} />
        <Stack.Screen name={AccountPage.LockAccount} component={LockAccount} />
        <Stack.Screen
          name={AccountPage.ChangePassword}
          component={ChangePassword}
        />
        <Stack.Screen
          name={AccountPage.CertifyEmail}
          component={CertifyEmail}
        />
      </Stack.Navigator>
    );
  }

  styles = StyleSheet.create({});
}

const Stack = createStackNavigator();
