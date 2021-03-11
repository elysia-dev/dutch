import React, { FunctionComponent, useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { H1Text, P1Text } from '../../shared/components/Texts';
import PasswordLayout from './components/PasswordLayout';
import NextButton from './components/NextButton';
import WalletContext from '../../contexts/WalletContext';
import { MainPage } from '../../enums/pageEnum';
import FunctionContext from '../../contexts/FunctionContext';

const ConfirmSeedPharase: FunctionComponent = () => {
  const navigation = useNavigation();
  const { setIsWalletUser } = useContext(FunctionContext);
  const { wallet } = useContext(WalletContext);

  return (
    <PasswordLayout>
      <View style={{ length: 200, marginTop: 100, marginBottom: 50 }}>
        <H1Text style={{ textAlign: 'center' }} label={'Confirm Seed Pharase'} />
        <P1Text style={{ textAlign: 'center' }} label={wallet?.getMnemonic() || ''} />
      </View>
      <NextButton
        title={'Next'}
        handler={() => {
          setIsWalletUser(true);
          navigation.navigate(MainPage.DashboardMain)
        }}
      />
    </PasswordLayout>
  );
};

export default ConfirmSeedPharase;