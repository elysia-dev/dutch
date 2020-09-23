import React, { FunctionComponent, useState } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { PText } from '../../shared/components/PText';
import { H1Text } from '../../shared/components/H1Text';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import AccountLayout from '../../shared/components/AccountLayout';

type ParamList = {
  ResetPassword: {
    currentPassword: string;
  };
};

const ResetPassword: FunctionComponent = () => {
  const [state, setState] = useState({
    step: 1,
    password: '',
    passwordConfirmation: '',
  });

  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ResetPassword'>>();

  const callChangeApi = () => {
    if (state.password !== state.passwordConfirmation) {
      alert(i18n.t('account_errors.password_do_not_match'));
    } else if (state.password.length < 8) {
      alert(i18n.t('account_errors.password_too_short'));
    } else if (state.password === route.params.currentPassword) {
      alert(i18n.t('account.reset_current_same'));
    } else {
      Api.resetPassword(state.password, route.params.currentPassword)
        .then(res => {
          // info페이지로 다시 돌아가게 해야함 !!
          if (res.data.status === 'success') {
            alert(i18n.t('account.password_changed'));
          } else if (res.data.status === 'wrong') {
            alert(i18n.t('account.reset_current_error'));
          } else if (res.data.status === 'same') {
            alert(i18n.t('account.reset_current_same'));
          }
          navigation.navigate('Main', { screen: 'MoreMain' });
        })
        .catch(e => {
          if (e.response.status === 400) {
            alert(i18n.t('account.reset_error'));
          } else if (e.response.status === 401) {
            alert(i18n.t('account.recover_verification_error'));
          } else if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
          navigation.navigate('Main', { screen: 'MoreMain' });
        });
    }
  };

  return (
    <AccountLayout
      title={
        <>
          <BackButton
            handler={() => {
              // eslint-disable-next-line no-unused-expressions
              state.step === 2
                ? setState({ ...state, step: 1 })
                : navigation.goBack();
            }}
            style={{ marginTop: 201, marginBottom: 20 }}
          />
          <View>
            <Text>{i18n.t('account_label.change_password')}</Text>
            <H1Text
              style={{ marginBottom: 15, marginTop: 60 }}
              label={
                state.step === 1
                  ? i18n.t('account.insert_new_password')
                  : i18n.t('account.password_confirm')
              }
            />
          </View>
        </>
      }
      body={
        <>
          {state.step === 2 && (
            <TextField
              label={i18n.t('account_label.account_password_confirm')}
              eventHandler={(input: string): void =>
                setState({ ...state, passwordConfirmation: input })
              }
              secure={true}
            />
          )}
          <TextField
            label={i18n.t('account_label.new_password')}
            editable={state.step === 1}
            eventHandler={
              state.step === 1
                ? (input: string) => setState({ ...state, password: input })
                : () => {}
            }
            secure={true}
          />
          {state.password === route.params.currentPassword && (
            <PText
              style={{ textAlign: 'center', marginTop: 20, marginBottom: 13 }}
              label={i18n.t('account.reset_current_same')}
            />
          )}
          <TextField
            label={i18n.t('account_label.current_password')}
            editable={false}
            eventHandler={() => {}}
            value={route.params.currentPassword}
            secure={true}
          />
        </>
      }
      button={
        <>
          {state.step === 1 ? (
            <SubmitButton
              title={i18n.t('account_label.continue')}
              handler={() => {
                if (state.password === '') {
                  alert(i18n.t('account.insert_password'));
                  return;
                }
                setState({ ...state, step: 2 });
              }}
            />
          ) : (
            <SubmitButton
              title={i18n.t('account_label.change')}
              handler={() => callChangeApi()}
            />
          )}
        </>
      }
    />
  );
};

export default ResetPassword;
