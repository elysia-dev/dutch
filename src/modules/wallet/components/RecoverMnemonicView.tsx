import React from 'react';
import { View, Text, TextInput } from "react-native";
import AppColors from '../../../enums/AppColors';

interface INemonicView {
  mnemonic: string[]
  setMnemonic: (value: string, index: number) => void
}

const MnemonicView: React.FC<INemonicView> = ({
  mnemonic,
  setMnemonic
}) => {
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
        mnemonic.map((word, index) => {
          return (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>{`${index + 1}.`}</Text>
              <TextInput
                style={{
                  marginLeft: 5,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: AppColors.GREY,
                  borderStyle: 'dashed',
                  width: 100,
                  height: 40,
                  padding: 10,
                }}
                value={word}
                onChangeText={(text) => setMnemonic(text, index)}
              />
            </View>
          )
        })
      }
    </View>
  )
}

export default MnemonicView