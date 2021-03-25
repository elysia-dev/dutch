import React, { FunctionComponent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation();

  return (
    <>
      <PasswordForm
        submitButtonTitle={t('account_label.continue')}
        submitHandler={async (password: string) => {
          Keyboard.dismiss();
          setLoading(true);
          await createNewWallet(password);
          setLoading(false);
          navigation.navigate(WalletPage.SecureWalletNotice)
        }}
        message1={t('account.create_password')}
        message2={t('account.password_confirm')}
      />
      <OverlayLoading visible={loading} />
    </>
  );
};

export default NewPassword;