import React, { FunctionComponent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next'
import PasswordForm from '../account/PasswordForm';
import WalletContext from '../../contexts/WalletContext';
import { Keyboard } from 'react-native'
import Loading from '../main/Loading';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainPage } from '../../enums/pageEnum';
import UserContext from '../../contexts/UserContext';

type ParamList = {
  RecoverWallet: {
    menmonic: string;
  };
};

const RecoverWallet: FunctionComponent = () => {
  const navigation = useNavigation();
  const { newWalletUser } = useContext(UserContext);
  const { restoreWallet } = useContext(WalletContext);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const route = useRoute<RouteProp<ParamList, 'RecoverWallet'>>();

  if (loading) {
    return <Loading />
  }

  return (
    <PasswordForm
      submitButtonTitle={t('account_label.continue')}
      submitHandler={async (password: string) => {
        Keyboard.dismiss();
        setLoading(true);
        // FIXME
        // 아래의 코드는 매우 이상할 수 이씀
        // 지갑을 복구할 경우 비동기가 아니라 동기로 작동하기 때문에, 너무 빠르게 진입하면 로딩인디케이터 보이기 전에 화면이 멈추는 일이 발생함.
        // 아래처럼 setTime을 주어 상태 변경 완료후 동기 코드로 진입하도록 제어함.
        await setTimeout(async () => {
          await restoreWallet(route.params.menmonic, password);
          newWalletUser();
          navigation.navigate(MainPage.DashboardMain)
        }, 500)
      }}
      message1={t('account.create_password')}
      message2={t('account.password_confirm')}
    />
  );
};

export default RecoverWallet;