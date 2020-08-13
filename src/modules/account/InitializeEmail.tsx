import React, { Component } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from "styled-components/native";

interface props {
  email: string;
  handler: (text: string) => void;
  // handler: (event: GestureResponderEvent) => void;
  // stageHandler: (stage: string) => void;
  stageHandler: () => void;
}
const InitializeEmailWrapper = styled.View`
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

export class InitializeEmail extends Component<props> {
  constructor(props: props) {
    super(props);
    // this.goToBack = this.goToBack.bind(this);
  }

  goToBack() {}

  render() {
    return (
      <InitializeEmailWrapper>
        <BackButton handler={this.goToBack} />
        <H1Text>이메일을 입력해주세요.</H1Text>
        <TextInput
          type="이메일"
          value={this.props.email}
          eventHandler={this.props.handler}
          edit={true}
          secure={false}
        />
        <SubmitButton
          title="계속"
          handler={this.props.stageHandler}
          //백이랑 통신해서 회원가입/로그인 나누는 로직 추가해야함 -> 스테이지로?
        />
      </InitializeEmailWrapper>
    );
  }
}

const styles = StyleSheet.create({});
