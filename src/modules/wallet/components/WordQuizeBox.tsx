import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppColors from '../../../enums/AppColors';

interface IWordQuizeBox {
  index: number;
  word: string;
  active: boolean;
  onPress: () => void;
}

const WordQuizeBox: React.FC<IWordQuizeBox> = ({ index, word, active, onPress }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', marginRight: 10 }}>
        {`${index + 1}.`}
      </Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: 5,
          borderStyle: 'dashed',
          borderColor: active ? AppColors.MAIN : AppColors.GREY,
          width: 100,
          height: 40,
          padding: 10,
        }}
        onPress={() => {
          onPress();
        }}
      >
        <Text style={{ textAlign: 'center' }}>{word}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WordQuizeBox;
