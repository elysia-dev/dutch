import React, { FunctionComponent } from 'react';
import { Platform, KeyboardAvoidingView, View } from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.SafeAreaView`
  padding-top: ${Platform.OS === 'android' ? '25px' : '0px'};
  height: 100%;
  background-color: #fff;
  overflow: hidden;
`;

interface Props {
  title: React.ReactNode;
  body: React.ReactNode;
  button: React.ReactNode;
}

const ConditionalKeyboardAvoidingView: FunctionComponent = props =>
  Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={{ flex: 1, flexDirection: 'column' }}>
      {props.children}
    </KeyboardAvoidingView>
  ) : (
    <View style={{ flex: 1 }}>{props.children}</View>
  );

const AccountLayout: FunctionComponent<Props> = props => {
  return (
    <Wrapper>
      <ConditionalKeyboardAvoidingView>
        <View style={{ marginLeft: '5%', marginRight: '5%' }}>
          {props.title}
        </View>
        <View style={{ marginTop: 30, marginLeft: '5%', marginRight: '5%' }}>
          {props.body}
        </View>
        <View style={{ marginTop: 'auto', marginBottom: 20 }}>
          {props.button}
        </View>
      </ConditionalKeyboardAvoidingView>
    </Wrapper>
  );
};

export default AccountLayout;
