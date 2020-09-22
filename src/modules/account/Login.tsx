import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { FlatButton } from '../../shared/components/FlatButton';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import { AccountPage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';
import AccountLayout from '../../shared/components/AccountLayout';
import ValidationMessage from '../../shared/components/ValidationMessage';
import { H1Text } from '../../shared/components/H1Text';

type ParamList = {
  Login: {
    email: string;
  };
};

const Login: FunctionComponent = () => {
  const [state, setState] = useState({
    modalVisible: false,
    error: 0,
    password: '',
  });
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'Login'>>();
  const { signIn } = useContext(UserContext);

  const storeToken = async (token: string) => {
    await AsyncStorage.setItem('@token', token);
  };

  const callRecoverApi = () => {
    Api.certifyEmail_recover(route.params.email, 'recoverPassword')
      .then(res =>
        navigation.navigate(AccountPage.CertifyRecover, {
          email: route.params.email,
          verificationId: res.data.verificationId,
          status: res.data.status,
        }),
      )
      .catch(e => {
        if (e.response && e.response.status === 400) {
          alert(i18n.t('account.invalid_email'));
          return;
        } else {
          alert(i18n.t('account.try_again_later'));
        }
      });
  };

  const callLoginApi = () => {
    if (state.password === '') {
      alert(i18n.t('account.insert_password'));
      return;
    } else if (state.password.length < 8) {
      alert(i18n.t('account_errors.password_too_short'));
      return;
    } else {
      Api.login(route.params.email, state.password)
        .then(async res => {
          console.log(res.data);
          // token local storage 저장
          if (res.data.status === 'wrong') {
            setState({ ...state, error: res.data.counts });
          } else if (res.data.status === 'locked') {
            navigation.navigate(AccountPage.LockAccount, {
              verificationId: res.data.verificationId,
              email: route.params.email,
            });
          } else if (res.data.status === 'success') {
            await storeToken(res.data.token);
            await signIn();
          }
        })
        .catch(e => {
          setState({ ...state, error: e.response.data.counts });
          if (e.response.status === 400) {
            alert(i18n.t('account.insert_password'));
          } else if (e.response.status === 404) {
            alert(i18n.t('account_errors.wrong_email'));
          } else if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
        });
    }
  };

  return (
    <AccountLayout
      title={
        <>
          <BackButton
            handler={() => {
              navigation.goBack();
            }}
          />
          <H1Text label={i18n.t('account_check.insert_password')} />
        </>
      }
      body={
        <>
          <TextField
            label={i18n.t('account_label.account_password')}
            eventHandler={(input: string) =>
              setState({ ...state, password: input })
            }
            secure={true}
            helperText={
              state.error !== 0
                ? ` ${i18n.t('errors.messages.password_do_not_match')} ${
                    state.error
                  }/5`
                : undefined
            }
            helperIcon={state.error !== 0 ? 'Error' : undefined}
          />
          <TextField
            label={i18n.t('account_label.account_email')}
            value={route.params.email}
            editable={false}
            eventHandler={() => {}}
          />
        </>
      }
      button={
        <>
          <SubmitButton
            title={i18n.t('account_label.login')}
            handler={() => callLoginApi()}
            variant={'WithFlat'}
          />
          <View style={{ height: 15 }} />
          <FlatButton
            title={i18n.t('account.forget_password_link')}
            handler={() => callRecoverApi()}
          />
        </>
      }
    />
  );
};

export default Login;
