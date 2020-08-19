import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";
import i18n from "../../i18n/i18n";

interface props {
  email: string;
  stageHandler: (input1: string, input2: string) => void;
  // stageHandler: () => void;
}

const SignupWrapper = styled.View`
  width: 375px;
  height: 811px;
  border: 1px solid #000; // 웹에서 모바일처럼 화면잡고 구분하기 좋게 border 그어뒀어요
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;

interface state {
  step: number;
  input1: string;
  input2: string;
}
export class Signup extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { step: 1, input1: "", input2: "" };
    this.nextStep = this.nextStep.bind(this);
    this.setInput1 = this.setInput1.bind(this);
    this.setInput2 = this.setInput2.bind(this);
  }

  nextStep(input: number) {
    console.log(this.state.step);
    this.setState({ step: input });
  } //'계속' 버튼을 누르면 state가 2로 변하고 비밀번호 확인하기 인풋과 가입하기 버튼이 활성화됨

  setInput1(input: string) {
    this.setState({ input1: input });
    console.log(`input1: ${this.state.input1}`);
  } // 첫 비밀번호 인풋을 저장

  setInput2(input: string) {
    this.setState({ input2: input });
    console.log(`input2: ${this.state.input2}`);
  } // 비밀번호 확인 인풋을 저장

  render() {
    return (
      <SignupWrapper>
        <BackButton
          handler={() => {
            this.state.step == 2 && this.nextStep(1);
          }}
        />
        <H1Text>
          {this.state.step == 1
            ? i18n.t("account_check.insert_password")
            : i18n.t("account_check.password_confirm")}
        </H1Text>
        {this.state.step == 2 && (
          <TextInput
            type={i18n.t("label.account_password_confirm")}
            edit={true}
            eventHandler={this.setInput2}
            value={""}
            secure={true}
            //input1, input2 비교
          />
        )}
        <TextInput
          type={i18n.t("label.account_password")}
          edit={this.state.step == 1 ? true : false}
          eventHandler={this.state.step == 1 ? this.setInput1 : () => {}}
          value={""}
          secure={true}
        />
        <TextInput
          type={i18n.t("label.account_email")}
          edit={false}
          eventHandler={() => {}}
          value={this.props.email}
          secure={false}
        />
        {this.state.step == 1 ? (
          <SubmitButton
            title={i18n.t("label.continue")}
            handler={() => this.nextStep(2)}
          />
        ) : (
          <SubmitButton
            title={i18n.t("label.signup")}
            handler={() =>
              this.props.stageHandler(this.state.input1, this.state.input2)
            }
          />
        )}
      </SignupWrapper>
    );
  }
}

const goToBack = () => {};
const goToNext = () => {};
