import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { P1Text, P2Text, TitleText } from '../../shared/components/Texts';
import Layout from './components/Layout';
import NextButton from '../../shared/components/NextButton';
import MnemonicView from './components/MnemonicView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CheckIcon from './components/CheckIcon';
import WalletContext from '../../contexts/WalletContext';
import i18n from '../../i18n/i18n';
import { BackButton } from '../../shared/components/BackButton';

interface IBackupSeedPharase {
  next: () => void;
}

const BackupSeedPharase: React.FC<IBackupSeedPharase> = ({ next }) => {
  const [confirmed, confirm] = useState<boolean>(false);
  const { wallet } = useContext(WalletContext);

  const navigation = useNavigation();
  return (
    <Layout>
      <View style={{ position: 'absolute', padding: 20 }}>
        <BackButton handler={() => navigation.goBack()} />
      </View>
      <TitleText
        style={{ marginTop: 50, lineHeight: 35, }}
        label={i18n.t('recovery_key.backup_seed')}
      />
      <P2Text
        style={{ marginTop: 10, marginBottom: 25 }}
        label={i18n.t('recovery_key.backup_seed_notice')}
      />
      <MnemonicView mnemonic={wallet?.getMnemonic() || ''} />
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => {
          confirm(!confirmed)
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', marginRight: '5%' }}>
          <CheckIcon checked={confirmed} />
          <P1Text style={{ marginLeft: 10 }} label={i18n.t('recovery_key.backup_seed_checkbox')} />
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>
        <NextButton
          title={i18n.t('recovery_key.next')}
          disabled={!confirmed}
          handler={next}
        />
      </View>
    </Layout>
  );
};

export default BackupSeedPharase;