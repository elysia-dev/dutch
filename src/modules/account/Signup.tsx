import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import WarningImg from "../../../src/shared/assets/images/warning.png";
import i18n from "../../i18n/i18n";
import Api from "../../api/account";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import { Dashboard } from "../dashboard/Dashboard";

const SignupWrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? "25px" : "0px"};
  height: 100%;
  background-color: #fff;
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;
const WarningIcon = styled.Image`
  width: 12px;
  height: 12px;
  top: 1px;
  flex: 1;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #1c1c1c;
  text-align: right;
  margin: 10px 5%;
`;

interface props {
  navigation: NavigationScreenProp<any>;
  route: NavigationRoute;
}

interface state {
  step: number;
  errorLength: number;
  errorReg: number;
  password: string;
  passwordConfirmation: string;
}
const CheckPassword = function(input1: string) {
  // 숫자와 영문이 모두 있는지 검사하고 T/F return 하는 함수입니다.
  var reg_pwd = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
  return !reg_pwd.test(input1) ? false : true;
};

export class Signup extends Component<props, state> {
  constructor(props: props) {
    super(props);

    this.state = {
      step: 1,
      password: "",
      passwordConfirmation: "",
      errorLength: 0,
      errorReg: 0,
    };

    this.nextStep = this.nextStep.bind(this);
    this.storeToken = this.storeToken.bind(this);
  }

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

  callSignupApi() {
    const { route, navigation } = this.props;
    const { verificationId } = route.params;
    if (this.state.password != this.state.passwordConfirmation) {
      alert(i18n.t("errors.messages.password_do_not_match"));
    } else if (this.state.password.length < 8) {
      alert(i18n.t("errors.messages.password_too_short"));
    } else {
      Api.signup(verificationId, this.state.password)
        .then(async (res) => {
          if (res.data.status === "success") {
            await this.storeToken(res.data.token);
            navigation.navigate("Main");
          }
        })
        .catch((e) => {
          alert(i18n.t("register.try_again_later"));
        });
    }
  }

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
              this.setState({
                passwordConfirmation: input,
                errorLength: input !== this.state.password ? 2 : 0,
              });
            }}
            value={""}
            secure={true}
          />
        )}
        {this.state.step == 2 && this.state.errorLength == 2 && (
          <PText>
            <WarningIcon source={WarningImg} />{" "}
            <PText>{i18n.t("errors.messages.password_do_not_match")}</PText>
          </PText>
        )}
        <TextInput
          type={i18n.t("account_label.account_password")}
          edit={this.state.step == 1 ? true : false}
          eventHandler={
            this.state.step == 1
              ? (input: string) => {
                  this.setState({
                    password: input,
                    errorLength: input.length < 8 ? 1 : 0,
                    errorReg: CheckPassword(input) ? 0 : 1,
                  });
                }
              : () => {}
          }
          value={""}
          secure={true}
        />
        {this.state.errorLength == 1 && (
          <PText>
            <WarningIcon source={WarningImg} resizeMode={"center"} />{" "}
            <PText>{i18n.t("errors.messages.password_too_short")}</PText>
          </PText>
        )}
        {this.state.errorLength == 0 && this.state.errorReg == 1 && (
          <PText>
            <WarningIcon source={WarningImg} resizeMode={"center"} />{" "}
            {i18n.t("errors.messages.simple_password")}
          </PText>
        )}
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
            handler={() => {
              if (this.state.password.length < 8) {
                alert(i18n.t("errors.messages.password_too_short"));
                return;
              }
              this.nextStep(2);
            }}
          />
        ) : (
          <SubmitButton
            title={i18n.t("account_label.signup")}
            handler={() => this.callSignupApi()}
          />
        )}
      </SignupWrapper>
    );
  }
}
