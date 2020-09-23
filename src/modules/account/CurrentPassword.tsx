import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TextField } from '../../shared/components/TextField';
import { BackButton } from '../../shared/components/BackButton';
import { SubmitButton } from '../../shared/components/SubmitButton';

import i18n from '../../i18n/i18n';
import { AccountPage } from '../../enums/pageEnum';
import AccountLayout from '../../shared/components/AccountLayout';
import { H1Text } from '../../shared/components/H1Text';

const CurrentPassword: FunctionComponent = () => {
  const [state, setState] = useState({
    password: '',
  });

  const navigation = useNavigation();

  return (
    <AccountLayout
      title={
        <>
          <BackButton handler={() => navigation.goBack()} />
          <H1Text label={i18n.t('account_label.change_password')} />
          <H1Text label={i18n.t('account.insert_current_password')} />
        </>
      }
      body={
        <TextField
          label={i18n.t('account_label.current_password')}
          eventHandler={(input: string) => setState({ password: input })}
          secure={true}
        />
      }
      button={
        <SubmitButton
          title={i18n.t('account_label.continue')}
          handler={() =>
            navigation.navigate(AccountPage.ResetPassword, {
              currentPassword: state.password,
            })
          }
        />
      }
    />
  );
};

export default CurrentPassword;
