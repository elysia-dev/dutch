import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { TextField } from '../../shared/components/TextField';
import { SubmitButton } from '../../shared/components/SubmitButton';
import BorderFlatButton from '../../shared/components/BorderFlatButton';
import LockAccountPng from './images/lockaccount.png';
import i18n from '../../i18n/i18n';
import { AccountPage } from '../../enums/pageEnum';

import { H1Text } from '../../shared/components/H1Text';
import { PText } from '../../shared/components/PText';
import AccountLayout from '../../shared/components/AccountLayout';
import RootContext from '../../contexts/RootContext';

const LockAccountImg = styled.Image`
  width: 100%;
  resize-mode: center;
  margin-top: 53px;
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
    focusing: false,
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'LockAccount'>>();
  const { Server } = useContext(RootContext);

  const callResendApi = () => {
    Server.certifyEmail_recover(route.params.email, 'recoverAccount')
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
    Server.certifyEmail(
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
    <AccountLayout
      title={
        <View>
          {!state.focusing && <LockAccountImg source={LockAccountPng} />}
        </View>
      }
      body={
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          <View>
            <H1Text
              style={{ marginTop: 10, textAlign: 'center' }}
              label={i18n.t('account.lockdown')}
            />
            <PText
              style={{ marginTop: 10, color: '#626368' }}
              label={i18n.t('account.lockdown_text')}
            />
            <View style={{ marginTop: 20 }} />
            <TextField
              label={i18n.t('account_label.authentication_code')}
              eventHandler={value => setState({ ...state, code: value })}
              autoFocus={true}
              focusHandler={value => setState({ ...state, focusing: value })}
            />
            <View
              style={{ marginTop: 10, display: 'flex', flexDirection: 'row' }}>
              <ExpTimeText style={{ marginLeft: 'auto' }}>
                {i18n.t('account.resending_code_mail_label')}
              </ExpTimeText>
              <BorderFlatButton
                handler={() => callResendApi()}
                title={i18n.t('account_label.resend_2')}
              />
            </View>
          </View>
        </View>
      }
      button={
        <SubmitButton
          title={i18n.t('account_label.certify')}
          handler={() => callCertifyApi()}
        />
      }
    />
  );
};

export default LockAccount;
