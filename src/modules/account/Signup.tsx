import React, { FunctionComponent, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useRoute, RouteProp } from '@react-navigation/native';
import i18n from '../../i18n/i18n';
import Api from '../../api/account';
import UserContext from '../../contexts/UserContext';
import PasswordForm from './PasswordForm';

type ParamList = {
  Signup: {
    verificationId: string;
    email: string;
  };
};

const Signup: FunctionComponent = () => {
  const { signIn, locale } = useContext(UserContext);
  const route = useRoute<RouteProp<ParamList, 'Signup'>>();

  const storeToken = async (token: string) => {
    await AsyncStorage.setItem('@token', token);
  };

  const callSignupApi = (password: string): void => {
    if (password.length < 8) {
      alert(i18n.t('account_errors.password_too_short'));
    } else {
      Api.signup(route.params.verificationId, password, locale)
        .then(async res => {
          if (res.data.status === 'success') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await storeToken(res.data.token!);
            await signIn();
          }
        })
        .catch(e => {
          if (e.response.status === 404) {
            alert(i18n.t('account.try_again_later'));
          } else if (e.response.status === 500) {
            alert(i18n.t('account_errors.server'));
          }
        });
    }
  };

  return (
    <PasswordForm
      submitHandler={callSignupApi}
      email={route.params.email}
      submitButtonTitle={i18n.t('account_label.signup')}
      message1={i18n.t('account.insert_password')}
      message2={i18n.t('account.password_confirm')}
    />
  );
};

export default Signup;
