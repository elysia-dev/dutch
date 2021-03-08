import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { H1Text, P1Text } from '../../shared/components/Texts';
import PasswordLayout from './components/PasswordLayout';
import { WalletPage } from '../../enums/pageEnum';
import NextButton from './components/NextButton';

const NewSeedPharase: FunctionComponent = () => {
  const navigation = useNavigation();

  return (
    <PasswordLayout>
      <View style={{ length: 200, marginTop: 100, marginBottom: 50 }}>
        <H1Text style={{ textAlign: 'center' }} label={'New Seed Pharase'} />
        <P1Text style={{ textAlign: 'center' }} label={'It used for authentication'} />
      </View>
      <NextButton
        title={'Next'}
        handler={() => navigation.navigate(WalletPage.ConfirmSeedPharase)}
      />
    </PasswordLayout>
  );
};

export default NewSeedPharase;