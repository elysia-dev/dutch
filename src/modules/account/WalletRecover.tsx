import React, { FunctionComponent, useContext, useState } from 'react';
import NextButton from '../../shared/components/NextButton';
import AccountLayout from '../../shared/components/AccountLayout';
import WalletContext from '../../contexts/WalletContext';
import FunctionContext from '../../contexts/FunctionContext';
import SignInStatus from '../../enums/SignInStatus';
import WalletStorage from '../../core/WalletStorage';
import { TouchableOpacity, View } from 'react-native';
import CheckIcon from '../wallet/components/CheckIcon';
import { P1Text } from '../../shared/components/Texts';
import i18n from '../../i18n/i18n';

const WalletRecover: FunctionComponent = () => {
  const { setLock } = useContext(WalletContext);
  const { signOut } = useContext(FunctionContext);
  const [confirmed, setConfirm] = useState(false);

  return (
    <AccountLayout
      title={<></>}
      body={
        <>
          <P1Text
            label={i18n.t('wallet.recover_infomation')}
          />
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => {
              setConfirm(!confirmed)
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row', marginRight: '5%' }}>
              <CheckIcon checked={confirmed} />
              <P1Text style={{ marginLeft: 10 }} label={i18n.t('wallet.recover_check')} />
            </View>
          </TouchableOpacity>
        </>
      }
      button={
        <>
          <NextButton
            style={{ marginTop: 'auto', marginLeft: '5%', marginRight: '5%' }}
            title={i18n.t('wallet.recover_button')}
            disabled={!confirmed}
            handler={async () => {
              setLock();
              await WalletStorage.clear();
              signOut(SignInStatus.SIGNOUT)
            }}
          />
        </>
      }
    />
  );
};

export default WalletRecover;
