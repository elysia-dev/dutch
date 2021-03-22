import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { H3Text, TitleText } from '../../shared/components/Texts';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { useTranslation } from 'react-i18next';
import AccountLayout from '../../shared/components/AccountLayout';
import FunctionContext from '../../contexts/FunctionContext';
import { MainPage, Page } from '../../enums/pageEnum';

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
  const { Server } = useContext(FunctionContext);
  const { t } = useTranslation();

  const callChangeApi = () => {
    if (state.password !== state.passwordConfirmation) {
      alert(t('account_errors.password_do_not_match'));
    } else if (state.password.length < 8) {
      alert(t('account_errors.password_too_short'));
    } else if (state.password === route.params.currentPassword) {
      alert(t('account.reset_current_same'));
    } else {
      Server.resetPassword(state.password, route.params.currentPassword)
        .then((res) => {
          // info페이지로 다시 돌아가게 해야함 !!
          if (res.data.status === 'success') {
            alert(t('account.password_changed'));
          } else if (res.data.status === 'wrong') {
            alert(t('account.reset_current_error'));
          } else if (res.data.status === 'same') {
            alert(t('account.reset_current_same'));
          }
          navigation.navigate(Page.Main, { screen: MainPage.MoreMain });
        })
        .catch((e) => {
          if (e.response.status === 400) {
            alert(t('account.reset_error'));
          } else if (e.response.status === 500) {
            alert(t('account_errors.server'));
          }
          navigation.navigate(Page.Main, { screen: MainPage.MoreMain });
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
          />
          <View>
            <TitleText label={t('account_label.change_password')} />
            <H3Text
              style={{ marginBottom: 15, marginTop: 0 }}
              label={
                state.step === 1
                  ? t('account.insert_new_password')
                  : t('account.password_confirm')
              }
            />
          </View>
        </>
      }
      body={
        <>
          {state.step === 2 && (
            <>
              <TextField
                label={t('account_label.account_password_confirm')}
                eventHandler={(input: string): void =>
                  setState({ ...state, passwordConfirmation: input })
                }
                secure={true}
                helperText={
                  state.password !== state.passwordConfirmation
                    ? t('account_errors.password_do_not_match')
                    : undefined
                }
                helperIcon={
                  state.password !== state.passwordConfirmation
                    ? 'Error'
                    : undefined
                }
              />
              <TextField
                label={t('account_label.new_password')}
                value={state.password}
                eventHandler={() => { }}
                editable={false}
                secure={true}
              />
            </>
          )}
          {state.step === 1 && (
            <TextField
              label={t('account_label.new_password')}
              editable={state.step === 1}
              eventHandler={
                state.step === 1
                  ? (input: string) => setState({ ...state, password: input })
                  : () => { }
              }
              secure={true}
              helperText={
                state.password === route.params.currentPassword
                  ? ` ${t('account.reset_current_same')} `
                  : undefined
              }
              helperIcon={
                state.password === route.params.currentPassword
                  ? 'Error'
                  : undefined
              }
            />
          )}
          <TextField
            label={t('account_label.current_password')}
            editable={false}
            eventHandler={() => { }}
            value={route.params.currentPassword}
            secure={true}
          />
        </>
      }
      button={
        <>
          {state.step === 1 ? (
            <SubmitButton
              title={t('account_label.continue')}
              disabled={state.password === route.params.currentPassword}
              variant={
                state.password === route.params.currentPassword
                  ? 'GrayTheme'
                  : ''
              }
              handler={() => {
                if (state.password === '') {
                  alert(t('account.insert_password'));
                  return;
                }
                setState({ ...state, step: 2 });
              }}
            />
          ) : (
            <SubmitButton
              title={t('account_label.change')}
              handler={() => callChangeApi()}
            />
          )}
        </>
      }
    />
  );
};

export default ResetPassword;
