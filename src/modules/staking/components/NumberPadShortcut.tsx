import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';
import AppColors from '../../../enums/AppColors';
import decimalFormatter from '../../../utiles/decimalFormatter';

interface Props {
  values: (number | 'all')[];
  inputValue: string;
  setValue: Dispatch<SetStateAction<string>>;
  maxValue?: number;
}

const NumberPadShortcut: React.FC<Props> = ({
  values,
  inputValue,
  setValue,
  maxValue,
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
          {value === 'all'
            ? t('staking.full_amount')
            : `+${commaFormatter(value)}`}
        </Text>
      </TouchableOpacity>
    );
  });

  function addValue(value: number | 'all') {
    if (value === 'all') {
      setValue(String(maxValue));
    } else {
      const newValue = parseFloat(inputValue || '0') + value;
      setValue(decimalFormatter(newValue, 6));
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
