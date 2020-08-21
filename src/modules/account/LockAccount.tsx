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
import i18n from "../../i18n/i18n";

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
        <H1Text>{i18n.t("lock_account.lockdown")}</H1Text>
        <PText>{i18n.t("lock_account.lockdown_text")}</PText>
        <TextInput
          type={i18n.t("account_label.authentication_code")}
          value=""
          edit={true}
          eventHandler={this.setCode}
          secure={false}
        />
        <Text>{i18n.t("lock_account.resending_code_mail_label")}</Text>
        <FlatButton
          handler={this.props.resendHandler}
          title={i18n.t("account_label.resend_2")}
        />
        <SubmitButton
          title={i18n.t("account_label.certify")}
          handler={() => this.props.stageHandler(this.state.code)}
        />
      </LockAccountWrapper>
    );
  }
}

const styles = StyleSheet.create({});
