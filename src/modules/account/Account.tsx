import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { InitializeEmail } from "./InitializeEmail";
import { Login } from "./Login";
import { LockAccount } from "./LockAccount";

interface props {}

interface state {
  email: string;
  password: string;
  locked: boolean;
  stage: number;
}

export class Account extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { email: "", password: "", locked: false, stage: 0 };
    this.setUserEmail = this.setUserEmail.bind(this);
    this.setUserPassword = this.setUserPassword.bind(this);
    this.setStage = this.setStage.bind(this);
  }

  setUserEmail(text: string) {
    this.setState({ email: text });
  }

  setUserPassword(text: string) {
    this.setState({ password: text });
  }

  setStage(stage: number) {
    this.setState({ stage: stage });
  }

  render() {
    // if (!fontLoaded) {
    //   return (
    //     <AppLoading
    //       startAsync={fetchFonts}
    //       onFinish={() => setFontLoaded(true)}
    //     />
    //   );
    // // }
    if (this.state.stage == 0) {
      return (
        <View>
          <InitializeEmail
            handler={this.setUserEmail}
            email={""}
            stageHandler={this.setStage}
          />
        </View>
      );
    } else if (this.state.stage == 1) {
      return (
        <View>
          <Login
            handler={this.setUserPassword}
            email={this.state.email}
            password={""}
            stageHandler={this.setStage}
          />
        </View>
      );
    }
    // else if (this.state.locked == true) {
    //   return (
    //     <View>
    //       <LockAccount />
    //     </View>
    //   );
    // }
  }
}

const styles = StyleSheet.create({});
