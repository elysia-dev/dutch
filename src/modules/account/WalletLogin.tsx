import React, { FunctionComponent, useContext, useState } from 'react';
import { TextField } from '../../shared/components/TextField';
import i18n from '../../i18n/i18n';
import { TitleText } from '../../shared/components/Texts';
import NextButton from '../../shared/components/NextButton';
import ExpiredAccount from './ExpiredAccount';
import AccountLayout from '../../shared/components/AccountLayout';
import WalletContext from '../../contexts/WalletContext';
import BorderButton from '../../shared/components/BorderButton';
import { useNavigation } from '@react-navigation/native';
import { AccountPage } from '../../enums/pageEnum';

const WalletLogin: FunctionComponent = () => {
  const [stage, setStage] = useState(0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(0);
  const { unlock } = useContext(WalletContext);
  const navigation = useNavigation();

  if (stage === 0) {
    return (
      <ExpiredAccount
        nextHandler={() => { setStage(1) }}
      />
    )
  }
  // TODO : 계정 초기화 버튼
  return (
    <AccountLayout
      title={
        <TitleText
          style={{ marginTop: 50 }}
          label={i18n.t('account.insert_password')}
        />
      }
      body={
        <>
          <TextField
            style={{ marginTop: 20 }}
            label={i18n.t('account_label.account_password')}
            eventHandler={(input: string) =>
              setPassword(input)
            }
            value={password}
            secure={true}
            helperText={error ? '비밀번호가 올바르지 않습니다.' : undefined}
            helperIcon={error ? 'Error' : undefined}
          />
        </>
      }
      button={
        <>
          <NextButton
            style={{ marginTop: 'auto', marginLeft: '5%', marginRight: '5%' }}
            title={i18n.t('account_label.login')}
            handler={async () => {
              try {
                await unlock(password)
              } catch (e) {
                setError(1)
              }
            }}
          />
          <BorderButton
            style={{ marginTop: 10, marginLeft: '5%', marginRight: '5%' }}
            title={'비밀번호가 기억나지 않아요.'}
            handler={() => {
              navigation.navigate(AccountPage.WalletRecover)
            }}
          />
        </>
      }
    />
  );
};

export default WalletLogin;
