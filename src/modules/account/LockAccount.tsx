import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  GestureResponderEvent,
} from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import styled from "styled-components/native";
import LockAccountPng from "./images/lockaccount.png";

const LockAccountImg = styled.Image`
  width: 209px;
  height: 198px;
  margin: 25px auto;
`;
const LockAccountWrapper = styled.View`
  width: 375px;
  height: 811px;
  border: 1px solid #000; // 웹에서 모바일처럼 화면잡고 구분하기 좋게 border 그어뒀어요 나중에 제거
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: center;
  margin: 25px auto;
  font-weight: bold;
`;
const PText = styled.Text`
  font-size: 12px;
  color: #626368;
  text-align: left;
  margin: 5px auto 32px auto;
  width: 90%;
`;
const LockAccountTextInput = styled.TextInput`
  margin-top: 30px;
`;

interface props {
  stageHandler: (input: string) => void;
  resendHandler: () => void;
}

interface state {
  code: string;
}

export class LockAccount extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { code: "" };
    this.setCode = this.setCode.bind(this);
  }

  setCode(input: string) {
    this.setState({ code: input });
    console.log(this.state.code);
  }

  render() {
    return (
      <LockAccountWrapper>
        <LockAccountImg source={LockAccountPng} />
        <H1Text>엘리시아 계정이 잠겼습니다!</H1Text>
        <PText>
          고객님의 계정이 로그인 시도 5회 실패로 인해 보호조치 되었습니다.{"\n"}
          고객님의 계정 이메일 주소로 전송된 인증코드를 입력바랍니다.
        </PText>
        <TextInput
          type="인증코드"
          value=""
          edit={true}
          eventHandler={this.setCode}
          secure={false}
        />
        <Text> 혹시 메일이 오지 않으셨나요?</Text>
        <FlatButton handler={this.props.resendHandler} title="다시 전송하기" />
        <SubmitButton
          title="인증하기"
          handler={() => this.props.stageHandler(this.state.code)}
        />
      </LockAccountWrapper>
    );
  }
}

const styles = StyleSheet.create({});
