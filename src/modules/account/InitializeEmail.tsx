import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";

interface props {
  email: string;
  handler: (text: string) => void;
}

export class InitializeEmail extends Component<props> {
  constructor(props: props) {
    super(props);
    // this.goToBack = this.goToBack.bind(this);
    // this.goToNext = this.goToNext.bind(this);
  }

  goToBack() {}
  goToNext() {}

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
        <SubmitButton title="계속" handler={this.goToNext} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
