import React, { FunctionComponent } from "react";
import { Platform, KeyboardAvoidingView, View } from "react-native";
import styled from "styled-components/native";

const Wrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? "41px" : "16px"};
  height: 100%;
  background-color: #fff;
`;

interface IProps {
  title: React.ReactNode
  body: React.ReactNode
  button: React.ReactNode
}

const AccountLayout: FunctionComponent<IProps> = (props) => {
  return (
    <Wrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1, flexDirection: "column" }}
      >
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          {props.title}
        </View>
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          {props.body}
        </View>
        <View style={{ marginTop: "auto", marginBottom: 10 }}>
          {props.button}
        </View>
      </KeyboardAvoidingView>
    </Wrapper>
  )
}

export default AccountLayout;