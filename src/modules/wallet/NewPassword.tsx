import React, { FunctionComponent, useContext } from 'react';
import i18n from '../../i18n/i18n';
import PasswordForm from '../account/PasswordForm';
import FunctionContext from '../../contexts/FunctionContext';
import WalletContext from '../../contexts/WalletContext';
import { Keyboard } from 'react-native'

const NewPassword: FunctionComponent = () => {
  const { setIsWalletUser } = useContext(FunctionContext);
  const { createNewWallet } = useContext(WalletContext);

  return (
    <PasswordForm
      submitButtonTitle={i18n.t('account_label.continue')}
      submitHandler={(password: string) => {
        Keyboard.dismiss();
        createNewWallet(password);
        setIsWalletUser(true);
      }}
      message1={i18n.t('account.create_password')}
      message2={i18n.t('account.password_confirm')}
    />
  );
};

export default NewPassword;