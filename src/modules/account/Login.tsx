import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { FlatButton } from '../../shared/components/FlatButton';
import { useTranslation } from 'react-i18next';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import { TitleText } from '../../shared/components/Texts';
import UserContext from '../../contexts/UserContext';
import { setToken } from '../../asyncStorages/token';
import PreferenceContext from '../../contexts/PreferenceContext';
import LocaleType from '../../enums/LocaleType';

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
  const { user, signIn, Server } = useContext(UserContext);
  const { t } = useTranslation();
  const { language } = useContext(PreferenceContext);

  const callRecoverApi = () => {
    Server.certifyEmail_recover(
      route.params.email,
      'recoverPassword',
      language || LocaleType.EN,
    )
      .then((res) =>
        navigation.navigate(AccountPage.CertifyRecover, {
          email: route.params.email,
          verificationId: res.data.verificationId,
          status: res.data.status,
        }),
      )
      .catch((e) => {
        if (e.response && e.response.status === 400) {
          alert(t('account.invalid_email'));
        } else {
          alert(t('account.try_again_later'));
        }
      });
  };

  const callLoginApi = () => {
    if (state.password === '') {
      alert(t('account.insert_password'));
    } else if (state.password.length < 8) {
      alert(t('account_errors.password_too_short'));
    } else {
      Server.login(route.params.email, state.password)
        .then(async (res) => {
          // token local storage 저장
          if (res.data.status === 'wrong') {
            setState({ ...state, error: res.data.counts! });
          } else if (res.data.status === 'locked') {
            navigation.navigate(AccountPage.LockAccount, {
              verificationId: res.data.verificationId,
              email: route.params.email,
            });
          } else if (res.data.status === 'success') {
            await setToken(res.data.token!);
            signIn();
            // navigation.navigate('Main');
          }
        })
        .catch((e) => {
          setState({ ...state, error: e.response.data.counts });
          if (e.response.status === 400) {
            alert(t('account.insert_password'));
          } else if (e.response.status === 404) {
            alert(t('account_errors.wrong_email'));
          } else if (e.response.status === 500) {
            alert(t('account_errors.server'));
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
          <TitleText label={t('account.insert_password')} />
        </>
      }
      body={
        <>
          <TextField
            label={t('account_label.account_password')}
            eventHandler={(input: string) =>
              setState({ ...state, password: input })
            }
            secure={true}
            helperText={
              state.error !== 0
                ? ` ${t('account_errors.password_do_not_match')} ${state.error
                }/5`
                : undefined
            }
            helperIcon={state.error !== 0 ? 'Error' : undefined}
          />
          <TextField
            label={t('account_label.account_email')}
            value={route.params.email}
            editable={false}
            eventHandler={() => { }}
          />
        </>
      }
      button={
        <>
          <SubmitButton
            title={t('account_label.login')}
            handler={() => callLoginApi()}
          />
          <View style={{ height: 15 }} />
          <FlatButton
            title={t('account.forget_password_link')}
            handler={() => callRecoverApi()}
          />
        </>
      }
    />
  );
};

export default Login;
