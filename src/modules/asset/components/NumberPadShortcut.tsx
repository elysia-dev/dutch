import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';

interface Props {
  current: string
  values: number[]
  inputValue: string
  setValues: Dispatch<SetStateAction<{ from: string; to: string; }>>
  ELAPrice: number
}

const NumberPadShortcut: React.FC<Props> = ({
  current,
  values,
  inputValue,
  setValues,
  ELAPrice,
}) => {
  const buttons = values.map((value) => {
    return (
      <TouchableOpacity
        key={value}
        style={{
          borderRadius: 5,
          borderColor: '#C8C8C8',
          borderWidth: 1,
          width: 56,
          height: 27,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => addValue(value)}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontFamily: AppFonts.Medium,
          }}
        >
          {`${current === 'to' ? '+' : '$'}${commaFormatter(value)}`}
        </Text>
      </TouchableOpacity>
    );
  });

  function addValue(value: number) {
    const newInputValue = parseFloat(inputValue || '0') + value // Number() 하면서 소수점이 엄청 생기지는 않나 검사해야 함..!!!!

    if (current === 'from') {
      setValues({
        from: String(newInputValue),
        to: (newInputValue / ELAPrice).toFixed(2),
      })
    } else {
      setValues({
        from: (newInputValue * ELAPrice).toFixed(2),
        to: String(newInputValue),
      })
    }
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
        }}
      >
        {buttons}
      </View>
    </View>
  );
};

export default NumberPadShortcut;