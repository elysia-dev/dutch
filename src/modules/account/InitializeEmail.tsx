import React, { FunctionComponent, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { TitleText } from '../../shared/components/Texts';
import i18n from '../../i18n/i18n';
// import Api from '../../api/account';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import checkMail from '../../utiles/checkMail';
import RootContext from '../../contexts/RootContext';

const InitializeEmail: FunctionComponent = () => {
  const [state, setState] = useState({
    email: '',
    errorLength: 1,
    errorReg: 0,
  });

  const navigation = useNavigation();
  const { Server } = useContext(RootContext);

  const callEmailApi = () => {
    if (!state.email) {
      alert(i18n.t('account.insert_account_email'));
      return;
    }

    Server.initializeEmail(state.email)
      .then(res => {
        navigation.navigate(
          res.data.status === 'exist'
            ? AccountPage.Login
            : AccountPage.CertifySignup,
          {
            verificationId: res.data.verificationId,
            email: state.email,
          },
        );
      })
      .catch(e => {
        if (e.response.status === 400) {
          alert(i18n.t('account.try_again_later'));
        } else if (e.response.status === 500) {
          alert(i18n.t('account_errors.server'));
        }
      });
  };

  return (
    <AccountLayout
      title={
        <TitleText
          style={{ paddingTop: 53 }}
          label={i18n.t('account.insert_account_email')}
        />
      }
      body={
        <TextField
          label={i18n.t('account_label.account_email')}
          eventHandler={(input: string) => {
            setState({
              email: input,
              errorLength: input.length === 0 ? 1 : 0,
              errorReg: checkMail(input) ? 0 : 1,
            });
          }}
          placeHolder="example@elysia.land"
        />
      }
      button={
        <SubmitButton
          title={
            // eslint-disable-next-line no-nested-ternary
            state.errorLength === 1
              ? i18n.t('account.insert_account_email')
              : state.errorReg === 1
              ? i18n.t('account.check_email')
              : i18n.t('account_label.continue')
          }
          handler={
            state.errorLength === 1 || state.errorReg === 1
              ? () => {}
              : () => callEmailApi()
          }
          variant={
            state.errorLength === 1 || state.errorReg === 1
              ? 'GrayTheme'
              : undefined
          }
        />
      }
    />
  );
};

export default InitializeEmail;
