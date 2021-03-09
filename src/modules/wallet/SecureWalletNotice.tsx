import React, { FunctionComponent, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { H1Text, P1Text } from '../../shared/components/Texts';
import PasswordLayout from './components/PasswordLayout';
import { WalletPage } from '../../enums/pageEnum';
import NextButton from './components/NextButton';
import { Wallet } from 'ethers';
import secureEthers from '../../utiles/secureEthers';
import Loading from '../main/Loading';

const SecureWalletNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    setWallet(secureEthers.Wallet.createRandom());
  }, [])

  if (!wallet) {
    return <Loading />
  }

  return (
    <PasswordLayout>
      <View style={{ length: 200, marginTop: 100, marginBottom: 50 }}>
        <H1Text style={{ textAlign: 'center' }} label={'Notice...!'} />
        <P1Text style={{ textAlign: 'center' }} label={'It used for authentication'} />
      </View>
      <NextButton
        title={'Next'}
        style={{
          marginLeft: 0,
          marginRight: 0,
          width: '100%'
        }}
        handler={() => navigation.navigate(WalletPage.BackupSeedPharase, { mnemonic: wallet.mnemonic.phrase })}
      />
    </PasswordLayout>
  );
};

export default SecureWalletNotice;