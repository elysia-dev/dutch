import React, { FunctionComponent, useContext, useState } from 'react';
import { Alert, TouchableOpacity, View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import NextButton from '../../shared/components/NextButton';
import AccountLayout from '../../shared/components/AccountLayout';
import WalletContext from '../../contexts/WalletContext';
import SignInStatus from '../../enums/SignInStatus';
import CheckIcon from '../wallet/components/CheckIcon';
import { P1Text } from '../../shared/components/Texts';
import UserContext from '../../contexts/UserContext';

const WalletRecover: FunctionComponent = () => {
  const { setLock, clearWallet } = useContext(WalletContext);
  const { signOut } = useContext(UserContext);
  const [confirmed, setConfirm] = useState(false);
  const { t } = useTranslation();

  return (
    <AccountLayout
      title={<></>}
      body={
        <>
          <P1Text label={t('wallet.recover_infomation')} />
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => {
              setConfirm(!confirmed);
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: '5%',
              }}>
              <CheckIcon checked={confirmed} />
              <P1Text
                style={{ marginLeft: 10 }}
                label={t('wallet.recover_check')}
              />
            </View>
          </TouchableOpacity>
        </>
      }
      button={
        <>
          <NextButton
            style={{
              marginTop: 'auto',
              marginLeft: '5%',
              marginRight: '5%',
              backgroundColor: '#c4302b',
            }}
            title={t('wallet.recover_button')}
            disabled={!confirmed}
            handler={async () => {
              if (Platform.OS !== 'android') {
                Alert.prompt(
                  t('more_label.delete_address'),
                  t('more.confirm_delete'),
                  async (res) => {
                    if (res === 'delete') {
                      setLock();
                      await clearWallet();
                      signOut(SignInStatus.SIGNOUT);
                    }
                  },
                );
              } else {
                Alert.alert(
                  t('more_label.delete_address'),
                  t('more.confirm_delete_android'),
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        setLock();
                        clearWallet();
                        signOut(SignInStatus.SIGNOUT);
                      },
                      style: 'default',
                    },
                  ],
                  { cancelable: false },
                );
              }
            }}
          />
        </>
      }
    />
  );
};

export default WalletRecover;
