import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { TitleText } from '../../shared/components/Texts';
import Layout from './components/Layout';
import NextButton from '../../shared/components/NextButton';
import RecoverMnemonicView from './components/RecoverMnemonicView';
import { isValidMnemonic } from '@ethersproject/hdnode';
import { useNavigation } from '@react-navigation/native';
import { WalletPage } from '../../enums/pageEnum';

type State = {
  currentIndex: number,
  mnemonic: string[],
}

const RecoverSeedPharase: FunctionComponent = () => {
  const navigation = useNavigation();
  const [state, setState] = useState<State>({
    currentIndex: 0,
    mnemonic: ['', '', '', '', '', '', '', '', '', '', '', ''],
    // for test
    //mnemonic: ['legend', 'guilt', 'quick', 'rice', 'lava', 'patch', 'exile', 'course', 'elegant', 'vault', 'chat', 'hill'],
  })

  return (
    <Layout>
      <TitleText
        style={{ marginTop: 50, lineHeight: 35, marginBottom: 20 }}
        label={'시드 문구를 입력해주세요.'}
      />
      <RecoverMnemonicView
        mnemonic={state.mnemonic}
        setMnemonic={(text, index) => {
          const mnemonic = state.mnemonic;
          mnemonic[index] = text;

          setState({ ...state, mnemonic })
        }}
      />
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>
        <NextButton
          title={'입력완료'}
          disabled={!isValidMnemonic(state.mnemonic.join(' '))}
          handler={async () => {
            navigation.navigate(WalletPage.RecoverWallet, {
              menmonic: state.mnemonic.join(' ')
            });
          }}
        />
      </View>
    </Layout>
  );
};

export default RecoverSeedPharase;