import React, { FunctionComponent, useContext, useState } from 'react';
import i18n from '../../i18n/i18n';
import PasswordForm from '../account/PasswordForm';
import WalletContext from '../../contexts/WalletContext';
import { Keyboard } from 'react-native'
import Loading from '../main/Loading';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainPage } from '../../enums/pageEnum';
import WalletStorage from '../../core/WalletStorage';
import FunctionContext from '../../contexts/FunctionContext';

type ParamList = {
  RecoverWallet: {
    menmonic: string;
  };
};

const RecoverWallet: FunctionComponent = () => {
  const navigation = useNavigation();
  const { newWalletUser } = useContext(FunctionContext);
  const { restoreWallet } = useContext(WalletContext);
  const [loading, setLoading] = useState<boolean>(false);

  const route = useRoute<RouteProp<ParamList, 'RecoverWallet'>>();

  if (loading) {
    return <Loading />
  }

  return (
    <PasswordForm
      submitButtonTitle={i18n.t('account_label.continue')}
      submitHandler={async (password: string) => {
        Keyboard.dismiss();
        setLoading(true);
        await WalletStorage.completeBackup();
        await restoreWallet(route.params.menmonic, password);
        newWalletUser();
        navigation.navigate(MainPage.DashboardMain)
      }}
      message1={i18n.t('account.create_password')}
      message2={i18n.t('account.password_confirm')}
    />
  );
};

export default RecoverWallet;