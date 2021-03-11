import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { H1Text, P1Text } from '../../shared/components/Texts';
import Layout from './components/Layout';
import { WalletPage } from '../../enums/pageEnum';
import NextButton from './components/NextButton';

const BackupSeedPharase: FunctionComponent = () => {
  const navigation = useNavigation();
  return (
    <Layout>
      <View style={{ length: 200, marginTop: 100, marginBottom: 50 }}>
        <H1Text style={{ textAlign: 'center' }} label={'New Seed Pharase'} />
        <P1Text style={{ textAlign: 'center' }} label={''} />
      </View>
      <NextButton
        title={'Next'}
        handler={() => navigation.navigate(WalletPage.ConfirmSeedPharase)}
      />
    </Layout>
  );
};

export default BackupSeedPharase;