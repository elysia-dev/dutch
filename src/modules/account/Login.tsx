import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { FlatButton } from "../../shared/components/FlatButton";
import { Modal } from "../../shared/components/Modal";
import styled from "styled-components/native";

interface props {
  email: string;
  // password: string;
  // handler: (text: string) => void;
  stageHandler: (stage: string) => void;
  findPassword: () => void;
  error: number;
}

interface state {
  password: string;
}

const LoginWrapper = styled.View`
  width: 375px;
  height: 811px;
  border: 1px solid #000; // 웹에서 모바일처럼 화면잡고 구분하기 좋게 border 그어뒀어요 나중에 제거
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;

export class Login extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = { password: "" };
    this.goToBack = this.goToBack.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  goToBack() {}

  setPassword(input: string) {
    this.setState({ password: input });
  }

  render() {
    return (
      <LoginWrapper>
        <BackButton handler={this.goToBack} />
        <H1Text>비밀번호를 입력해주세요.</H1Text>
        <TextInput
          type="비밀번호"
          value={""}
          edit={true}
          eventHandler={this.setPassword}
          secure={true}
        />
        {this.props.error > 0 && (
          <Text>비밀번호가 틀렸습니다. ({this.props.error}/5)</Text>
        )}
        <TextInput
          type="이메일"
          value={this.props.email}
          edit={false}
          eventHandler={() => {}}
          secure={false}
        />
        <SubmitButton
          title="로그인"
          handler={() => this.props.stageHandler(this.state.password)}
        />
        <FlatButton
          title="비밀번호를 잊으셨나요?"
          handler={this.props.findPassword}
        />
      </LoginWrapper>
    );
  }
}
const styles = StyleSheet.create({});
