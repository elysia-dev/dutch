import React, { FunctionComponent, useState } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import AccountLayout from '../../shared/components/AccountLayout';

const H1Text = styled.Text`
  color: #1c1c1c;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  margin-top: 60px;
`;
const PText = styled.Text`
  color: #626368;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
  margin-top: 20px;
`;

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
            <H1Text>
              {state.step === 1
                ? i18n.t('account.insert_new_password')
                : i18n.t('account.password_confirm')}
            </H1Text>
          </View>
        </>
      }
      body={
        <>
          {state.step === 2 && (
            <TextField
              label={i18n.t('account_label.account_password_confirm')}
              edit={true}
              eventHandler={(input: string): void =>
                setState({ ...state, passwordConfirmation: input })
              }
              value={''}
              secure={true}
            />
          )}
          <TextField
            label={i18n.t('account_label.new_password')}
            edit={state.step === 1}
            eventHandler={
              state.step === 1
                ? (input: string) => setState({ ...state, password: input })
                : () => {}
            }
            value={''}
            secure={true}
          />
          {state.password === route.params.currentPassword && (
            <PText>{i18n.t('account.reset_current_same')}</PText>
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
