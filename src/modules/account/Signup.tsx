import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from 'styled-components/native';
import WarningImg from '../../../src/shared/assets/images/warning.png';
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

interface state {
  step: number;
  input1: string;
  input2: string;
  errorState: number;
}
const CheckPassword = function(input1: string) { // 숫자와 영문이 모두 있는지 검사하고 T/F return 하는 함수입니다.
  var reg_pwd = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
  return !reg_pwd.test(input1) ? false : true;
};

export class Signup extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { step: 1, input1: "", input2: "", errorState: 0 };
    this.nextStep = this.nextStep.bind(this);
    this.setInput1 = this.setInput1.bind(this);
    this.setInput2 = this.setInput2.bind(this);
  }

  nextStep(input: number) {
    console.log(this.state.step);
    this.setState({ step: input });
  } //'계속' 버튼을 누르면 state가 2로 변하고 비밀번호 확인하기 인풋과 가입하기 버튼이 활성화됨

  setInput1(input: string) {
    if(input.length < 7){ // 만약 7자리 이하라면
      this.setState({ errorState: 1}); // ErrorState = 1
    } else if (!CheckPassword(input)) { // 함수를 체크하고 만약 영문, 숫자가 있지 않다면
      this.setState({ errorState: 2}); // ErrorState = 2
    } else {
      this.setState({ errorState: 0}); // 모든 조건을 만족하면 만약 1이나 2일 경우를 위해 ErrorState = 0 으로 변경 한 뒤
      this.setState({ input1: input }); // 마저 인풋 저장
      console.log(`input1: ${this.state.input1}`);
    }
  } // 첫 비밀번호 인풋을 저장

  setInput2(input: string) {
    if(input != this.state.input1) { // 현재 input과 input1 state를 비교
      this.setState({ errorState: 3}); // 불일치시 ErrorState = 3
    } else {
      this.setState({ errorState: 0});
      this.setState({ input2: input }); // input2 저장.
      console.log(`input2: ${this.state.input2}`);
    }
  } 

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
            type={i18n.t("account_label.account_password_confirm")}
            edit={true}
            eventHandler={this.setInput2}
            value={""}
            secure={true}
            //input1, input2 비교
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
          eventHandler={this.state.step == 1 ? this.setInput1 : () => {}}
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
          value={this.props.email}
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
            handler={() =>
              this.props.stageHandler(this.state.input1, this.state.input2)
            }
          />
          */
        )}
      </SignupWrapper>
    );
  }
}

const goToBack = () => {};
const goToNext = () => {};
