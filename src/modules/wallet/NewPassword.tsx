import React, { FunctionComponent, useContext, useState } from 'react';
import i18n from '../../i18n/i18n';
import PasswordForm from '../account/PasswordForm';
import WalletContext from '../../contexts/WalletContext';
import { Keyboard } from 'react-native'
import OverlayLoading from '../../shared/components/OverlayLoading';
import { useNavigation } from '@react-navigation/native';
import { WalletPage } from '../../enums/pageEnum';

const NewPassword: FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { createNewWallet } = useContext(WalletContext);
  const navigation = useNavigation();

  return (
    <>
      <PasswordForm
        submitButtonTitle={i18n.t('account_label.continue')}
        submitHandler={async (password: string) => {
          Keyboard.dismiss();
          setLoading(true);
          await createNewWallet(password);
          setLoading(false);
          navigation.navigate(WalletPage.SecureWalletNotice)
        }}
        message1={i18n.t('account.create_password')}
        message2={i18n.t('account.password_confirm')}
      />
      <OverlayLoading visible={loading} />
    </>
  );
};

export default NewPassword;