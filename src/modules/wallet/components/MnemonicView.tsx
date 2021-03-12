import React from 'react';
import { View, Text } from "react-native";
import AppColors from '../../../enums/AppColors';
import WordBox from './WordBox';

interface INemonicView {
  mnemonic: string
}

const MnemonicView: React.FC<INemonicView> = (props) => {
  return (
    <View
      style={{
        borderWidth: 2,
        borderRadius: 5,
        borderColor: AppColors.GREY,
        padding: 15,
        height: 300,
        display: 'flex',
        alignContent: 'space-around',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}
    >
      {
        props.mnemonic.split(' ').map((word, index) => {
          return <WordBox key={index} index={index + 1} word={word} />
        })
      }
    </View>
  )
}

export default MnemonicView