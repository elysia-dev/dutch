import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';
import AppColors from '../../../enums/AppColors';
import decimalFormatter from '../../../utiles/decimalFormatter';

interface Props {
  values: (number | 'max')[];
  inputValue: string;
  setValue: Dispatch<SetStateAction<string>>;
  maxValue?: number;
  setIsMax: Dispatch<SetStateAction<boolean>>;
}

const NumberPadShortcut: React.FC<Props> = ({
  values,
  inputValue,
  setValue,
  maxValue,
  setIsMax,
}) => {
  const { t } = useTranslation();
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
          {value === 'max'
            ? t('staking.full_amount')
            : `+${commaFormatter(value)}`}
        </Text>
      </TouchableOpacity>
    );
  });

  function addValue(value: number | 'max') {
    if (value === 'max') {
      setValue(decimalFormatter(parseFloat(maxValue), 6));
      setIsMax(true);
    } else {
      const newValue = parseFloat(inputValue || '0') + value;
      setValue(decimalFormatter(newValue, 6));
      setIsMax(false);
    }
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
