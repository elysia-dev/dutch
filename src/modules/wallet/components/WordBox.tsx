import React from 'react';
import { View, Text } from 'react-native';
import AppColors from '../../../enums/AppColors';

interface IWordBox {
  index: number;
  word: string;
}

const WordBox: React.FC<IWordBox> = ({ index, word }) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 5,
        borderColor: AppColors.MAIN,
        width: 150,
        padding: 8,
      }}>
      <Text style={{ textAlign: 'center' }}>{`${index}. ${word}`}</Text>
    </View>
  );
};

export default WordBox;
