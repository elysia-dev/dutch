import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { InitializeEmail } from "./InitializeEmail";
import { Login } from "./Login";

interface props {}

interface state {
  email: string;
  password: string;
  locked: boolean;
}

export class Account extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { email: "", password: "", locked: false };
    this.setUserEmail = this.setUserEmail.bind(this);
    this.setUserPassword = this.setUserPassword.bind(this);
  }

  setUserEmail(text: string) {
    this.setState({ email: text });
  }
  //text onchange event의 type 찾아보기

  setUserPassword(text: string) {
    this.setState({ password: text });
  }

  render() {
    // if (!fontLoaded) {
    //   return (
    //     <AppLoading
    //       startAsync={fetchFonts}
    //       onFinish={() => setFontLoaded(true)}
    //     />
    //   );
    // }
    return (
      <View>
        <InitializeEmail handler={this.setUserEmail} email={""} />
        <Login
          email={this.state.email}
          password={""}
          handler={this.setUserPassword}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
