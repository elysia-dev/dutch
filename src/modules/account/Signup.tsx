import { StatusBar } from "expo-status-bar";
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "../../shared/components/TextInput";
import { BackButton } from "../../shared/components/BackButton";
import { SubmitButton } from "../../shared/components/SubmitButton";
import styled from 'styled-components/native';

interface props {
  email: string;
  handler: (text: string) => void;
}

const SignupWrapper = styled.View`
  width: 375px;
  height: 811px;
  border: 1px solid #000; // 웹에서 모바일처럼 화면잡고 구분하기 좋게 border 그어뒀어요
`;
const H1Text = styled.Text`
  font-size: 20px;
  color: #1C1C1C;
  text-align: left;
  margin: 25px 5%;
  font-weight: bold;
`;

export const Signup: FunctionComponent<props> = (props) => {
  return (
    <SignupWrapper>
      <BackButton handler={goToBack} />
      <H1Text>비밀번호를 입력해주세요.</H1Text>
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
    </SignupWrapper>
  );
};

const goToBack = () => {};
const goToNext = () => {};
