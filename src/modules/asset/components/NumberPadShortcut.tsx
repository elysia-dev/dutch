import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';
import AppColors from '../../../enums/AppColors';
import decimalFormatter from '../../../utiles/decimalFormatter';

interface Props {
  current: string;
  values: (number | 'max')[];
  inputValue: string;
  setValues: Dispatch<SetStateAction<{ inFiat: string; inToken: string }>>;
  ELAPrice: number;
  maxValueInToken: number;
  maxValueInFiat: number;
  setIsMax: Dispatch<SetStateAction<boolean>>;
}

const NumberPadShortcut: React.FC<Props> = ({
  current,
  values,
  inputValue,
  setValues,
  ELAPrice,
  maxValueInToken,
  maxValueInFiat,
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
            : current === 'token'
            ? `+${commaFormatter(value)}`
            : `$${commaFormatter(value)}`}
        </Text>
      </TouchableOpacity>
    );
  });

  function addValue(value: number | 'max') {
    if (value === 'max') {
      setValues({
        inFiat: String(decimalFormatter(maxValueInFiat, 2)),
        inToken: String(decimalFormatter(maxValueInToken, 4)),
      });
      setIsMax(true);
    } else {
      const newInputValue = parseFloat(inputValue || '0') + value;

      if (current === 'fiat') {
        setValues({
          inFiat: decimalFormatter(newInputValue, 2),
          inToken: decimalFormatter(newInputValue / ELAPrice, 6),
        });
      } else {
        setValues({
          inFiat: decimalFormatter(newInputValue * ELAPrice, 2),
          inToken: decimalFormatter(newInputValue, 6),
        });
      }
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
