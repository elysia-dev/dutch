import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import AppColors from '../../../enums/AppColors';

interface ITouchableWordBox {
  selected: boolean;
  word: string;
  onPress: () => void;
}

const TouchableWordBox: React.FC<ITouchableWordBox> = ({ selected, word, onPress }) => {
  return (
    <TouchableOpacity
      disabled={selected}
      style={{
        borderColor: selected ? AppColors.GREY : AppColors.MAIN,
        borderWidth: 1,
        borderRadius: 5,
        width: 110,
        padding: 8,
      }}
      onPress={() => {
        !selected && onPress();
      }}
    >
      <Text style={{ textAlign: 'center' }}>{word}</Text>
    </TouchableOpacity>
  );
};

export default TouchableWordBox;
