import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { P2Text, TitleText } from '../../shared/components/Texts';
import Layout from './components/Layout';
import NextButton from '../../shared/components/NextButton';
import { MainPage } from '../../enums/pageEnum';
import MnemonicQuize from './components/MnemonicQuize';
import TouchableWordBox from './components/TouchableWordBox'
import WalletContext from '../../contexts/WalletContext';
import WalletStorage from '../../core/WalletStorage';
import FunctionContext from '../../contexts/FunctionContext';

type State = {
  currentIndex: number,
  selectedWords: [string, string, string, string],
  selectedIndices: [number, number, number, number],
  ramdomizedMnemonic: string[],
}

const ConfirmSeedPharase: FunctionComponent = () => {
  const { wallet } = useContext(WalletContext);
  const { setIsWalletUser } = useContext(FunctionContext);
  const navigation = useNavigation();
  const [state, setState] = useState<State>({
    currentIndex: 0,
    selectedWords: ['', '', '', ''],
    selectedIndices: [0, 0, 0, 0],
    ramdomizedMnemonic: wallet!.getMnemonic().split(' ').sort(() => .5 - Math.random())
  })

  useEffect(() => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .sort(() => .5 - Math.random())
      .filter((_item, index) => index <= 3).sort((a, b) => a - b);

    setState({
      ...state,
      selectedIndices: [arr[0], arr[1], arr[2], arr[3]]
    })
  }, [])

  return (
    <Layout>
      <TitleText
        style={{ marginTop: 50, lineHeight: 35, }}
        label={'시드 문구를 확인해주세요.'}
      />
      <P2Text
        style={{ marginTop: 10, marginBottom: 25 }}
        label={'보관하신 시드문구를 확인하는 단계입니다.\n정확히 입력해주세요.'}
      />
      <MnemonicQuize
        currentIndex={state.currentIndex}
        selectedIndices={state.selectedIndices}
        selectedWords={state.selectedWords}
        clear={(index) => {
          const newWords = state.selectedWords
          newWords[index] = '';
          setState({
            ...state,
            selectedWords: newWords,
            currentIndex: index,
          })
        }}
      />
      <View
        style={{
          marginTop: 20,
          height: 190,
          display: 'flex',
          alignContent: 'space-between',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {
          state.ramdomizedMnemonic.map((word, index) => {
            return <TouchableWordBox
              key={index}
              word={word}
              selected={!!state.selectedWords.find((selctedWord) => word === selctedWord)}
              onPress={() => {
                if (state.currentIndex >= 4) return

                const newWords = state.selectedWords
                newWords[state.currentIndex] = word;

                setState({
                  ...state,
                  selectedWords: newWords,
                  currentIndex: state.currentIndex + 1,
                })
              }}
            />
          })
        }
      </View>
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>
        <NextButton
          title={'확인 완료'}
          disabled={
            !state.selectedIndices.reduce((res, cur, index) => res && (state.selectedWords[index] === wallet?.getMnemonic().split(' ')[cur]), true)
          }
          handler={async () => {
            await WalletStorage.completeBackup();
            setIsWalletUser(true);
            navigation.navigate(MainPage.DashboardMain)
          }}
        />
      </View>
    </Layout>
  );
};

export default ConfirmSeedPharase;