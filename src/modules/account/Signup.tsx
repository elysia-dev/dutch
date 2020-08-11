import { StatusBar } from "expo-status-bar";
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";

interface props {
  email: string;
  handler: (text: string) => void;
}

export const Signup: FunctionComponent<props> = (props) => {
  return (
    <View>
      <BackButton handler={goToBack} />
      <Text>비밀번호를 입력해주세요.</Text>
      {/* 조건에 따라 다시한번으로 바뀌게 처리해야함 */}
      <TextInput
        type="비밀번호"
        edit={true}
        eventHandler={props.handler}
        value={""}
        secure={true}
      />
      <TextInput
        type="이메일"
        edit={false}
        eventHandler={() => {}}
        value={props.email}
        secure={false}
      />
      <SubmitButton title="계속" handler={goToNext} />
    </View>
  );
};

const goToBack = () => {};
const goToNext = () => {};
