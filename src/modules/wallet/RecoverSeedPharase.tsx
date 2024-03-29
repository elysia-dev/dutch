import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isValidMnemonic } from '@ethersproject/hdnode';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TitleText } from '../../shared/components/Texts';
import Layout from './components/Layout';
import NextButton from '../../shared/components/NextButton';
import RecoverMnemonicView from './components/RecoverMnemonicView';
import { WalletPage } from '../../enums/pageEnum';

type State = {
  currentIndex: number;
  mnemonic: string[];
};

const RecoverSeedPharase: FunctionComponent = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<State>({
    currentIndex: 0,
    mnemonic: ['', '', '', '', '', '', '', '', '', '', '', ''],
    // for test
    // mnemonic: ['conduct', 'come', 'lobster', 'cliff', 'harsh', 'journey', 'inner', 'airport', 'awkward', 'weapon', 'sibling', 'borrow'],
  });

  return (
    <Layout>
      <TitleText
        style={{ marginTop: 50, lineHeight: 35, marginBottom: 20 }}
        label={t('recovery_key.insert_seed')}
      />
      <RecoverMnemonicView
        mnemonic={state.mnemonic}
        setMnemonic={(text, index) => {
          const mnemonic = state.mnemonic;
          mnemonic[index] = text;

          setState({ ...state, mnemonic });
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom || 10,
          width: '100%',
        }}>
        <NextButton
          title={t('recovery_key.insert_seed_btn')}
          disabled={!isValidMnemonic(state.mnemonic.join(' '))}
          handler={async () => {
            navigation.navigate(WalletPage.RecoverWallet, {
              menmonic: state.mnemonic.join(' '),
            });
          }}
        />
      </View>
    </Layout>
  );
};

export default RecoverSeedPharase;
