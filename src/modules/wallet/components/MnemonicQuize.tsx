import React from 'react';
import { View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import WordQuizeBox from './WordQuizeBox';

interface INemonicView {
  currentIndex: number;
  selectedIndices: number[];
  selectedWords: string[];
  clear: (number: number) => void;
}

const MnemonicQuize: React.FC<INemonicView> = ({
  currentIndex,
  selectedIndices,
  selectedWords,
  clear,
}) => {
  return (
    <View
      style={{
        borderWidth: 2,
        borderRadius: 5,
        borderColor: AppColors.GREY,
        padding: 15,
        height: 130,
        display: 'flex',
        alignContent: 'space-around',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}>
      {selectedIndices.map((selectedIndex, index) => {
        return (
          <WordQuizeBox
            key={index}
            index={selectedIndex}
            word={selectedWords[index]}
            active={currentIndex === index}
            onPress={() => clear(index)}
          />
        );
      })}
    </View>
  );
};

export default MnemonicQuize;
