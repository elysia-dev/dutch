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
            label={'경고문구 추가해야합니다.'}
          />
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => {
              setConfirm(!confirmed)
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row', marginRight: '5%' }}>
              <CheckIcon checked={confirmed} />
              <P1Text style={{ marginLeft: 10 }} label={'위 사항을 충분히 이해하며, 동의하고 엘리시아를 처음부터 시작하겠습니다.'} />
            </View>
          </TouchableOpacity>
        </>
      }
      button={
        <>
          <NextButton
            style={{ marginTop: 'auto', marginLeft: '5%', marginRight: '5%' }}
            title={'동의하고, 처음부터 시작하기'}
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
