import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { TextField } from '../../shared/components/TextField';
import { SubmitButton } from '../../shared/components/SubmitButton';
import BorderFlatButton from '../../shared/components/BorderFlatButton';
import LockAccountPng from './images/lockaccount.png';
import { useTranslation } from 'react-i18next';
import { AccountPage } from '../../enums/pageEnum';

import { H1Text, P1Text, P3Text } from '../../shared/components/Texts';
import AccountLayout from '../../shared/components/AccountLayout';
import UserContext from '../../contexts/UserContext';
import PreferenceContext from '../../contexts/PreferenceContext';
import LocaleType from '../../enums/LocaleType';

const LockAccountImg = styled.Image`
  width: 100%;
  resize-mode: center;
  margin-top: 53px;
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
  const { user, Server } = useContext(UserContext);
  const { language } = useContext(PreferenceContext);
  const { t } = useTranslation();

  const callResendApi = () => {
    Server.certifyEmail_recover(
      route.params.email,
      'recoverAccount',
      language || LocaleType.EN,
    )
      .then((res) => {
        setState({ ...state, verificationId: res.data.verificationId! });
        alert(t('account.resend_verification'));
      })
      .catch((e) => alert(t('account.try_again_later')));
  };

  const callCertifyApi = () => {
    if (!state.code) {
      alert(t('account.authentication_recover'));
      return;
    }
    Server.certifyEmail(
      state.verificationId || route.params.verificationId,
      state.code,
    )
      .then((res) => {
        if (res.data.status === 'completed') {
          navigation.navigate(AccountPage.RecoverPassword, {
            verificationId: state.verificationId || route.params.verificationId,
            email: route.params.email,
          });
        } else if (res.data.status === 'expired') {
          alert(t('account.expired_verification'));
        } else {
          alert(
            t('account.unmatched_verification', {
              error: res.data.counts,
            }),
          );
        }
      })
      .catch((e) => {
        if (e.response.status === 404) {
          alert(t('resigter.expired_verification'));
        } else if (e.response.status === 500) {
          alert(t('account_errors.server'));
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
              label={t('account.lockdown')}
            />
            <P1Text
              style={{ marginTop: 10, color: '#626368' }}
              label={t('account.lockdown_text')}
            />
            <View style={{ marginTop: 20 }} />
            <TextField
              label={t('account_label.authentication_code')}
              eventHandler={(value) => setState({ ...state, code: value })}
              autoFocus={true}
              focusHandler={(value) => setState({ ...state, focusing: value })}
            />
            <View
              style={{ marginTop: 10, display: 'flex', flexDirection: 'row' }}>
              <P3Text
                style={{
                  marginLeft: 'auto',
                  color: '#1c1c1c',
                  fontSize: 13,
                  marginRight: '2%',
                  lineHeight: 21,
                  height: 21,
                }}
                label={t('account.resending_code_mail_label')}
              />
              <BorderFlatButton
                handler={() => callResendApi()}
                title={t('account_label.resend_2')}
              />
            </View>
          </View>
        </View>
      }
      button={
        <SubmitButton
          title={t('account_label.certify')}
          handler={() => callCertifyApi()}
        />
      }
    />
  );
};

export default LockAccount;
