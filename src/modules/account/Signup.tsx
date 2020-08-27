import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";

const SignupWrapper = styled.View`
  width: 375px;
  height: 811px;
  background-color: #fff;
  border: 1px solid #000; // 웹에서 모바일처럼 화면잡고 구분하기 좋게 border 그어뒀어요
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  step: number;
  password: string;
  passwordConfirmation: string;
}
export class Signup extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { step: 1, password: "", passwordConfirmation: "" };
    this.nextStep = this.nextStep.bind(this);
    this.storeToken = this.storeToken.bind(this);
    this.storeEmail = this.storeEmail.bind(this);
  }

  storeEmail = async (email: string) => {
    try {
      await AsyncStorage.setItem("@email", email).then((res) =>
        console.log("successfully stored")
      );
    } catch (e) {
      console.error(e);
    }
  };

  nextStep(input: number) {
    console.log(this.state.step);
    this.setState({ step: input });
  } //'계속' 버튼을 누르면 state가 2로 변하고 비밀번호 확인하기 인풋과 가입하기 버튼이 활성화됨

  storeToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("@token", token);
      console.log("successfully stored");
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { route, navigation } = this.props;
    const { verificationId, email } = route.params;
    return (
      <SignupWrapper>
        <BackButton
          handler={() => {
            this.state.step == 2 ? this.nextStep(1) : navigation.goBack();
          }}
        />
        <H1Text>
          {this.state.step == 1
            ? i18n.t("account_check.insert_password")
            : i18n.t("account_check.password_confirm")}
        </H1Text>
        {this.state.step == 2 && (
          <TextInput
            type={i18n.t("account_label.account_password_confirm")}
            edit={true}
            eventHandler={(input: string) => {
              this.setState({ passwordConfirmation: input });
            }}
            value={""}
            secure={true}
          />
        )}
        <TextInput
          type={i18n.t("account_label.account_password")}
          edit={this.state.step == 1 ? true : false}
          eventHandler={
            this.state.step == 1
              ? (input: string) => {
                  this.setState({ password: input });
                }
              : () => {}
          }
          value={""}
          secure={true}
        />
        <TextInput
          type={i18n.t("account_label.account_email")}
          edit={false}
          eventHandler={() => {}}
          value={email}
          secure={false}
        />
        {this.state.step == 1 ? (
          <SubmitButton
            title={i18n.t("account_label.continue")}
            handler={() => this.nextStep(2)}
          />
        ) : (
          <SubmitButton
            title={i18n.t("account_label.signup")}
            handler={() => {
              if (this.state.password != this.state.passwordConfirmation) {
                alert(i18n.t("errors.messages.password_do_not_match"));
              } else if (this.state.password.length < 8) {
                alert(i18n.t("errors.messages.password_too_short"));
              } else {
                Api.signup(verificationId, this.state.password)
                  .then((res) => {
                    if (res.data.status === "success") {
                      this.storeToken(res.data.token);
                      this.storeEmail(email);
                      navigation.navigate("Main", {
                        email: email,
                        password: this.state.password,
                      });
                    }
                  })
                  .catch((e) => {
                    alert(i18n.t("register.authentication_error"));
                  });
              }
            }}
          />
        )}
      </SignupWrapper>
    );
  }
}
