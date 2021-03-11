import React, { FunctionComponent, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { H1Text, P1Text } from '../../shared/components/Texts';
import PasswordLayout from './components/PasswordLayout';
import { WalletPage } from '../../enums/pageEnum';
import NextButton from './components/NextButton';
import WalletContext from '../../contexts/WalletContext';
import Loading from '../main/Loading';

type RouteParams = {
  SecureWalletNotice: {
    password: string;
  };
};

const SecureWalletNotice: FunctionComponent = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, WalletPage.SecureWalletNotice>>();
  const { isUnlocked, createNewWallet } = useContext(WalletContext);

  useEffect(() => {
    createNewWallet(route.params.password);
  }, [])

  if (!isUnlocked) {
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
        handler={() => navigation.navigate(WalletPage.BackupSeedPharase)}
      />
    </PasswordLayout>
  );
};

export default SecureWalletNotice;