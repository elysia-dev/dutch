import React, { Component } from "react";
import { StyleSheet, Text, View, GestureResponderEvent } from "react-native";
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
  handler: (text: string) => void;
  // handler: (event: GestureResponderEvent) => void;
  // stageHandler: (stage: string) => void;
  stageHandler: () => void;
}

export class InitializeEmail extends Component<props> {
  constructor(props: props) {
    super(props);
    // this.goToBack = this.goToBack.bind(this);
  }

  goToBack() {}

  render() {
    return (
      <View>
        <BackButton handler={this.goToBack} />
        <Text>이메일을 입력해주세요.</Text>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({});
