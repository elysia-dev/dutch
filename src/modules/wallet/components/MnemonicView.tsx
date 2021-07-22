import React from 'react';
import { View } from "react-native";
import AppColors from '../../../enums/AppColors';
import WordBox from './WordBox';

interface INemonicView {
  mnemonic: string;
}

const MnemonicView: React.FC<INemonicView> = (props) => {
  const wordListing = props.mnemonic.split(' ').map((word, index) => {
    return (
      <WordBox key={index} index={index + 1} word={word} />
    );
  });
  return (
    <View
      style={{
        borderWidth: 2,
        borderRadius: 5,
        borderColor: AppColors.GREY,
        padding: 15,
        height: 320,
        display: 'flex',
        flexDirection: "row",
        alignContent: 'space-between',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
      }}>
        {wordListing[0]}
        {wordListing[1]}
        {wordListing[2]}
        {wordListing[3]}
        {wordListing[4]}
        {wordListing[5]}
      </View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
      }}>
        {wordListing[6]}
        {wordListing[7]}
        {wordListing[8]}
        {wordListing[9]}
        {wordListing[10]}
        {wordListing[11]}
      </View>
    </View>
  );
};

export default MnemonicView;
