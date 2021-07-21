import React, { FunctionComponent } from 'react';
import { Platform, KeyboardAvoidingView, View, SafeAreaView } from 'react-native';

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
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        height: '100%',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
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
    </SafeAreaView>
  );
};

export default AccountLayout;
