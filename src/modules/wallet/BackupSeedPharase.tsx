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

interface IBackupSeedPharase {
  next: () => void;
}

const BackupSeedPharase: React.FC<IBackupSeedPharase> = ({ next }) => {
  const [confirmed, confirm] = useState<boolean>(false);
  const { wallet } = useContext(WalletContext);

  const navigation = useNavigation();
  return (
    <Layout>
      <TitleText
        style={{ marginTop: 50, lineHeight: 35, }}
        label={'고객님의 복구키입니다.\n반드시 보관해주세요.'}
      />
      <P2Text
        style={{ marginTop: 10, marginBottom: 25 }}
        label={'아래의 복구키를 종이에 적어 안전한 곳에 보관해주세요.\n다음 단계에서 시드문구를 확인할 예정입니다.'}
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
          <P1Text style={{ marginLeft: 10 }} label={'위 시드문구를 보관하였으며, 다음 단게 진행에 동의함을 확인합니다.'} />
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>
        <NextButton
          title={'Next'}
          disabled={!confirmed}
          handler={next}
        />
      </View>
    </Layout>
  );
};

export default BackupSeedPharase;