import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from 'styled-components/native';
import WarningImg from '../../../src/shared/assets/images/warning.png';
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
const WarningIcon = styled.Image`
  width: 12px;
  height: 12px;
  margin: 0px 5px;
  position: relative;
  top: 1px;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #1C1C1C;
  text-align: right;
  margin: 0px 5%;
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
const CheckPassword = function(input1: string) { // 숫자와 영문이 모두 있는지 검사하고 T/F return 하는 함수입니다.
  var reg_pwd = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
  return !reg_pwd.test(input1) ? false : true;
};

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
        {this.state.errorState == 3 && (
          <PText>
            <WarningIcon source={WarningImg} />
            비밀번호가 일치하지 않습니다.
          </PText>
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
        
        {this.state.errorState == 1 && ( // ErrorState 1 : 비밀번호 자리수가 너무 적음
          <PText>
            <WarningIcon source={WarningImg} />
            비밀번호는 7자 이상이어야 합니다
          </PText>
        )}
        {this.state.errorState == 2 && ( // ErrorState 2 : 영문과 숫자가 모두 포함되어야 함
          <PText>
            <WarningIcon source={WarningImg} />
            비밀번호는 영문, 숫자가 모두 포함되어야 합니다.
          </PText>
        )}
        
        <TextInput
          type={i18n.t("account_label.account_email")}
          edit={false}
          eventHandler={() => {}}
          value={email}
          secure={false}
        />
        {this.state.step == 1 && (
          <SubmitButton title="계속" handler={this.nextStep} />
        )}
        {this.state.step == 2 && (
          this.state.errorState == 3 ? // ErrorState 3 : 비밀번호가 일치하지 않으면 아무 이벤트 없는 handler 버튼을 출력, 일치하면 stageHandler button 변환
          <SubmitButton title="비밀번호를 확인해주세요" handler={() => { }}/>
          :
          <SubmitButton title="가입하기" handler={this.props.stageHandler} />
          /*
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
          */
        )}
      </SignupWrapper>
    );
  }
}
