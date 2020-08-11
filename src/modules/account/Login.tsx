import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";

interface props {
  email: string;
  password: string;
  handler: (text: string) => void;
  stageHandler: (stage: number) => void;
}

interface state {
  error: number;
}

export class Login extends Component<props, state> {
  constructor(props: props) {
    super(props);
    this.goToBack = this.goToBack.bind(this);
    this.goToNext = this.goToNext.bind(this);
  }

  goToBack() {}
  goToNext() {}

  render() {
    return (
      <View>
        <BackButton handler={this.goToBack} />
        <Text>비밀번호를 입력해주세요.</Text>
        <TextInput
          type="비밀번호"
          value={""}
          edit={true}
          eventHandler={this.props.handler}
          secure={true}
        />
        <TextInput
          type="이메일"
          value={this.props.email}
          edit={false}
          eventHandler={() => {}}
          secure={false}
        />
        <SubmitButton
          title="로그인"
          handler={this.props.stageHandler}
          nextStage={2}
        />
        <Text>비밀번호를 잊으셨나요?</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
