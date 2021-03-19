import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Text, View } from 'react-native';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import CryptoInput from '..//components/CryptoInput';
import { H4Text, H3Text } from '../../../shared/components/Texts';
import AppColors from '../../../enums/AppColors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import currencyFormatter from '../../../utiles/currencyFormatter';
import TxStep from '../../../enums/TxStep';
import OverlayLoading from '../../../shared/components/OverlayLoading';
import { useNavigation } from '@react-navigation/native';
import CryptoType from '../../../enums/CryptoType';
import CurrencyContext from '../../../contexts/CurrencyContext';
import i18n from '../../../i18n/i18n';

interface ITxInput {
  title: string
  fromInputTitle: string
  toInputTitle: string
  fromCrypto: CryptoType
  fromTitle: string
  toCrypto: CryptoType
  toTitle: string
  fromPrice: number
  toPrice: number
  values: { from: string, to: string }
  current: string
  step: TxStep
  disabled: boolean
  setCurrent: Dispatch<SetStateAction<"from" | "to">>
  setValues: Dispatch<SetStateAction<{ from: string; to: string; }>>
  createTx: () => void
}

const TxInput: React.FC<ITxInput> = ({
  title,
  fromInputTitle,
  toInputTitle,
  fromCrypto,
  fromTitle,
  fromPrice,
  toPrice,
  toCrypto,
  toTitle,
  values,
  current,
  step,
  disabled,
  setCurrent,
  setValues,
  createTx,
}) => {
  const navigation = useNavigation();
  const { currencyUnit, currencyRatio } = useContext(CurrencyContext);
  const fromToRatio = fromPrice / toPrice;

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: AppColors.BACKGROUND_GREY,
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <H4Text label={i18n.t('assets.cancel')} style={{ color: AppColors.MAIN }} />
        </TouchableOpacity>
        <H3Text label={title} style={{}} />
        <View style={{ width: 20 }} />
      </View>
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: '#fff',
          height: '100%',
        }}>
        <CryptoInput
          title={fromInputTitle}
          cryptoTitle={fromTitle}
          cryptoType={fromCrypto}
          style={{ marginTop: 20 }}
          value={values.from || '0'}
          subValue={
            currencyFormatter(
              currencyUnit,
              currencyRatio,
              parseFloat(values.from || '0') * fromPrice,
              2,
            )}
          active={current === 'from'}
          onPress={() => setCurrent('from')}
        />
        <Text style={{ textAlign: 'center', fontSize: 20, color: AppColors.MAIN, marginTop: 5, marginBottom: 5 }}>↓</Text>
        <CryptoInput
          title={toInputTitle}
          cryptoTitle={toTitle}
          cryptoType={toCrypto}
          style={{ marginBottom: 30 }}
          value={values.to || '0'}
          active={current === 'to'}
          onPress={() => setCurrent('to')}
        />
        <View style={{ width: '100%', height: 1, marginTop: 0, marginBottom: 20, backgroundColor: AppColors.GREY }} />
        <NumberPad
          addValue={(text) => {
            const before = current === 'from' ? values.from : values.to
            if (text === '.' && before.includes('.') || before.length > 18) {
              return
            }

            const next = before + text

            if (current === 'from') {
              setValues({
                from: parseFloat(next).toString(),
                to: (parseFloat(next || '0') * fromToRatio).toFixed(2),
              })
            } else {
              setValues({
                from: (parseFloat(next || '0') / fromToRatio).toFixed(2),
                to: parseFloat(next).toString(),
              })
            }
          }}
          removeValue={() => {
            const before = current === 'from' ? values.from : values.to

            const next = before.slice(0, -1)

            if (current === 'from') {
              setValues({
                from: next,
                to: (parseFloat(next || '0') * fromToRatio).toFixed(2),
              })
            } else {
              setValues({
                from: (parseFloat(next || '0') / fromToRatio).toFixed(2),
                to: next,
              })
            }
          }}
        />
        <NextButton
          disabled={disabled}
          title={title}
          handler={() => {
            createTx()
          }}
        />
      </View>
      <OverlayLoading visible={[TxStep.Approving, TxStep.CheckAllowance, TxStep.Creating].includes(step)} />
    </>
  )
}

export default TxInput;