import React, { FunctionComponent, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Button,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useHeaderHeight, HeaderHeightContext } from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { Constants } from 'expo';
import styled from 'styled-components/native';
import { TextField } from '../../shared/components/TextField';
import { SubmitButton } from '../../shared/components/SubmitButton';
import BorderFlatButton from '../../shared/components/BorderFlatButton';
import LockAccountPng from './images/lockaccount.png';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayoutPosition';

import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';

const LockAccountImg = styled.Image`
  width: 100%;
  margin: 60px auto 30px auto;
  resize-mode: center;
`;
const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  margin-right: 2%;
  line-height: 21px;
  height: 21px;
`;

type ParamList = {
  LockAccount: {
    email: string;
    verificationId: string;
    isFocus: boolean;
  };
};

const LockAccount: FunctionComponent = () => {
  const [state, setState] = useState({
    code: '',
    verificationId: '',
    isFocus: false,
  });
  const TextInputFocus = React.createRef();

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'LockAccount'>>();

  const callResendApi = () => {
    Api.certifyEmail_recover(route.params.email, 'recoverAccount')
      .then(res => {
        setState({ ...state, verificationId: res.data.verificationId! });
        alert(i18n.t('account.resend_verification'));
      })
      .catch(e => alert(i18n.t('account.try_again_later')));
  };

  const callCertifyApi = () => {
    if (!state.code) {
      alert(i18n.t('account.authentication_recover'));
      return;
    }
    Api.certifyEmail(
      state.verificationId || route.params.verificationId,
      state.code,
    )
      .then(res => {
        if (res.data.status === 'completed') {
          navigation.navigate(AccountPage.RecoverPassword, {
            verificationId: state.verificationId || route.params.verificationId,
            email: route.params.email,
          });
        } else if (res.data.status === 'expired') {
          alert(i18n.t('account.expired_verification'));
        } else {
          alert(
            i18n.t('account.unmatched_verification', {
              error: res.data.counts,
            }),
          );
        }
      })
      .catch(e => {
        if (e.response.status === 404) {
          alert(i18n.t('resigter.expired_verification'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <ScrollView
      style={{
        backgroundColor: 'cyan',
        flexGrow: 1,
        borderColor: '#F00',
        borderWidth: 10,
      }}>
      <KeyboardAvoidingView
        behavior="padding" // {Platform.OS == "ios" ? "padding" : "position"}
        keyboardVerticalOffset={10}
        style={{
          height: '100%',
          borderColor: 'blue',
          borderWidth: 10,
          backgroundColor: '#cfcfcf',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ height: 100, backgroundColor: 'yellow', flex: 1 }} />
          <View style={{ backgroundColor: 'green', flex: 4 }}>
            <LockAccountImg source={LockAccountPng} />
            <H1Text
              style={{ marginTop: 10, textAlign: 'center' }}
              label={i18n.t('lock_account.lockdown')}
            />
            <PText
              style={{ marginTop: 10, color: '#626368' }}
              label={i18n.t('lock_account.lockdown_text')}
            />
            <View style={{ marginTop: 30 }} />
            <TextField
              label={i18n.t('account_label.authentication_code')}
              eventHandler={value => setState({ ...state, code: value })}
              autoFocus={true}
            />
            <View
              style={{ marginTop: 10, display: 'flex', flexDirection: 'row' }}>
              <ExpTimeText style={{ marginLeft: 'auto' }}>
                {i18n.t('lock_account.resending_code_mail_label')}
              </ExpTimeText>
              <BorderFlatButton
                handler={() => callResendApi()}
                title={i18n.t('account_label.resend_2')}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <SubmitButton
              title={i18n.t('account_label.certify')}
              handler={() => callCertifyApi()}
              style={{
                marginBottom: 20,
                bottom: 0,
                marginTop: 'auto',
                flex: 1,
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default LockAccount;
