import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';
import AppColors from '../../../enums/AppColors';
import decimalFormatter from '../../../utiles/decimalFormatter';

interface Props {
  // current: string;
  values: number[];
  inputValue: string;
  // setValues: Dispatch<SetStateAction<{ inFiat: string; inToken: string }>>;
  // ELAPrice: number;
  setValue: Dispatch<SetStateAction<string>>;
}

const NumberPadShortcut: React.FC<Props> = ({
  // current,
  values,
  inputValue,
  // setValues,
  // ELAPrice,
  setValue,
}) => {
  const buttons = values.map((value) => {
    return (
      <TouchableOpacity
        key={value}
        style={{
          borderRadius: 5,
          borderColor: AppColors.GREY2,
          borderWidth: 1,
          width: 56,
          height: 27,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => addValue(value)}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontFamily: AppFonts.Medium,
          }}>
          {/* {`${current === 'token' ? '+' : '$'}${commaFormatter(value)}`} */}
          {`+${commaFormatter(value)}`}
        </Text>
      </TouchableOpacity>
    );
  });

  function sliceZero(value: string) {
    let newValue = value;
    for (let i = value.length - 1; i > 0; i--) {
      if (value[i] === '0') {
        newValue = newValue.slice(0, -1);
      } else {
        break;
      }
    }
    return newValue;
  }

  function addValue(value: number) {
    // const newInputValue = parseFloat(inputValue || '0') + value;
    const newValue = parseFloat(inputValue || '0') + value;

    // if (current === 'fiat') {
    //   setValues({
    //     inFiat: decimalFormatter(newInputValue, 2),
    //     inToken: sliceZero(decimalFormatter(newInputValue / ELAPrice, 6)),
    //   });
    // } else {
    //   setValues({
    //     inFiat: decimalFormatter(newInputValue * ELAPrice, 2),
    //     inToken: sliceZero(decimalFormatter(newInputValue, 6)),
    //   });
    // }
    setValue(decimalFormatter(newValue, 6));
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
        }}>
        {buttons}
      </View>
    </View>
  );
};

export default NumberPadShortcut;