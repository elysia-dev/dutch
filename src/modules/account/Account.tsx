import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { InitializeEmail } from "./InitializeEmail";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { LockAccount } from "./LockAccount";
import { CurrentPassword } from "./CurrentPassword";
import { ResetPassword } from "./ResetPassword";
import { RecoverPassword } from "./RecoverPassword";
import { CertifySignup } from "./CertifySignup";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountPage } from "../../enums/pageEnum";
import { CertifyRecover } from "./CertifyRecover";

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
          name={AccountPage.CurrentPassword}
          component={CurrentPassword}
        />
        <Stack.Screen
          name={AccountPage.ResetPassword}
          component={ResetPassword}
        />
        <Stack.Screen
          name={AccountPage.RecoverPassword}
          component={RecoverPassword}
        />
        <Stack.Screen
          name={AccountPage.CertifySignup}
          component={CertifySignup}
        />
        <Stack.Screen
          name={AccountPage.CertifyRecover}
          component={CertifyRecover}
        />
      </Stack.Navigator>
    );
  }

  styles = StyleSheet.create({});
}

const Stack = createStackNavigator();
