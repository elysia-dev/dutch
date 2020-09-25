import React, { FunctionComponent, PropsWithRef } from 'react';
import { Platform, KeyboardAvoidingView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
  isBackbutton: boolean; // 버튼이 없을때에도 title의 margin-top 부분을 동일하게 만들기 위함
  isScrolling: boolean;
  button?: React.ReactNode;
}
type Scrolling = {
  Scrolling: boolean;
};
const ConditionalKeyboardAvoidingView: FunctionComponent = props =>
  Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      behavior={'position'}
      style={{ flex: 1, flexDirection: 'column' }}>
      {props.children}
    </KeyboardAvoidingView>
  ) : (
    <View style={{ flex: 1 }}>{props.children}</View>
  );

const ScrollingView: FunctionComponent<Scrolling> = props => {
  return props.Scrolling === true ? (
    <ScrollView style={{ flex: 1 }}>{props.children}</ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{props.children}</View>
  );
};
const WrapperLayout: FunctionComponent<Props> = props => {
  return (
    <Wrapper>
      <ScrollingView Scrolling={props.isScrolling}>
        <ConditionalKeyboardAvoidingView>
          <View
            style={{
              marginLeft: '5%',
              marginRight: '5%',
              marginTop: props.isBackbutton === false ? 68 : 0,
            }}>
            {props.title}
          </View>
          <View style={{ marginTop: 30 }}>{props.body}</View>
          {props.button !== undefined && (
            <View style={{ marginTop: 'auto', marginBottom: 20 }}>
              {props.button}
            </View>
          )}
        </ConditionalKeyboardAvoidingView>
      </ScrollingView>
    </Wrapper>
  );
};

export default WrapperLayout;
