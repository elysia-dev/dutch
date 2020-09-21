/* eslint-disable arrow-parens */
/* eslint-disable implicit-arrow-linebreak */
import React, { Component, FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { TextInput } from '../../shared/components/TextInput';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import BorderFlatButton from '../../shared/components/BorderFlatButton';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import { Timer } from './components/Timer';

const H1Text = styled.Text`
  font-size: 20px;
  color: #1c1c1c;
  text-align: left;
  font-weight: bold;
`;
const PText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
`;
const ButtonWrapper = styled.View`
  flex-direction: row-reverse;
`;
const ExpTimeText = styled.Text`
  color: #1c1c1c;
  font-size: 13px;
  line-height: 21px;
  height: 21px;
`;

interface Props {
  existence: string;
  certified: string;
}

type ParamList = {
  CertifySignup: {
    email: string;
    verificationId: string;
  };
};

const CertifySignup: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    code: '',
    verificationId: '',
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'CertifySignup'>>();

  const callResendApi = (): void => {
    Api.initializeEmail(route.params.email)
      .then(res => {
        setState({
          ...state,
          verificationId: res.data.verificationId,
        });
        alert(i18n.t('account.resend_verification'));
      })
      .catch(e => {
        alert(i18n.t('account.try_again_later'));
      });
  };

  const callCertifyApi = (): void => {
    if (!state.code) {
      alert(i18n.t('account.authentication_recover'));
      return;
    }
    Api.certifyEmail(
      state.verificationId === ''
        ? route.params.verificationId
        : state.verificationId,
      state.code,
    )
      .then(res => {
        if (res.data.status === 'completed') {
          navigation.navigate(AccountPage.Signup, {
            email: route.params.email,
            verificationId:
              state.verificationId === ''
                ? route.params.verificationId
                : state.verificationId,
          });
        } else if (res.data.status === 'expired') {
          alert(i18n.t('account.expired_verification'));
          //   navigation.navigate(AccountPage.InitializeEmail);
        } else {
          alert(
            i18n.t('account.unmatched_verification', {
              error: res.data.counts,
            }),
          );
        }
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('account.authentication_recover'));
        } else if (e.response.status === 404) {
          alert(i18n.t('account.expired_verification'));
          navigation.navigate(AccountPage.InitializeEmail);
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <AccountLayout
      title={
        <>
          <BackButton
            handler={(): void =>
              navigation.navigate(AccountPage.InitializeEmail)
            }
            style={{ marginTop: 20, marginBottom: 20 }}
          />
          <H1Text style={{ marginBottom: 10 }}>
            {i18n.t('account.authentication_signup')}
          </H1Text>
          <PText>{i18n.t('account.authentication_signup_label')}</PText>
        </>
      }
      body={
        <>
          <TextInput
            type={i18n.t('account_label.account_email')}
            edit={false}
            value={route.params.email}
            eventHandler={() => {}}
            secure={false}
          />
          <View style={{ height: 30 }} />
          <TextInput
            type={i18n.t('account_label.authentication_code')}
            edit={true}
            value={''}
            eventHandler={value => setState({ ...state, code: value })}
            secure={false}
          />
          <ButtonWrapper style={{ marginTop: 10 }}>
            <BorderFlatButton
              title={i18n.t('account_label.resend')}
              handler={() => callResendApi()}
            />
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <ExpTimeText style={{ marginLeft: 'auto' }}>{`${i18n.t(
                'account.expiration_time',
              )}`}</ExpTimeText>
              <Timer verif={state.verificationId} />
            </View>
          </ButtonWrapper>
        </>
      }
      button={
        <>
          <SubmitButton
            title={i18n.t('account_label.certify')}
            handler={(): void => callCertifyApi()}
          />
        </>
      }
    />
  );
};

export default CertifySignup;
