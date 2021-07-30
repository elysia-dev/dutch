import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import { TitleText, H3Text } from '../../shared/components/Texts';

const CurrentPassword: FunctionComponent = () => {
  const [state, setState] = useState({
    password: '',
  });
  const { t } = useTranslation();

  const navigation = useNavigation();

  return (
    <AccountLayout
      title={
        <>
          <BackButton handler={() => navigation.goBack()} />
          <TitleText label={t('account_label.change_password')} />
          <H3Text label={t('account.insert_current_password')} />
        </>
      }
      body={
        <TextField
          label={t('account_label.current_password')}
          eventHandler={(input: string) => setState({ password: input })}
          secure={true}
        />
      }
      button={
        <SubmitButton
          title={t('account_label.continue')}
          handler={() => {
            if (state.password === '') {
              return alert(t('more.invalid_password'));
            }
            navigation.navigate(AccountPage.ResetPassword, {
              currentPassword: state.password,
            });
          }}
        />
      }
    />
  );
};

export default CurrentPassword;
