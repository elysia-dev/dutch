import React, { FunctionComponent } from 'react';
import { Platform, KeyboardAvoidingView, View } from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === 'android' ? '41px' : '16px'};
  height: 100%;
  background-color: #fff;
`;

interface Props {
  title: React.ReactNode;
  body: React.ReactNode;
  button: React.ReactNode;
}
const ConditionalKeyboardAvoidingView: FunctionComponent = (props) =>
  (Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={{ flex: 1, flexDirection: 'column' }}>
      {props.children}
    </KeyboardAvoidingView>
  ) : (
    <View style={{ flex: 1 }}>{props.children}</View>
  ));
const AccountLayout: FunctionComponent<Props> = (props) => {
  return (
    <Wrapper>
      <ConditionalKeyboardAvoidingView>
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          {props.title}
        </View>
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          {props.body}
        </View>
        <View style={{ marginTop: 'auto', marginBottom: 10 }}>
          {props.button}
        </View>
      </ConditionalKeyboardAvoidingView>
    </Wrapper>
  );
};

export default AccountLayout;
