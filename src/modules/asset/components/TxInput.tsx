import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Text, View } from 'react-native';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import CryptoInput from '..//components/CryptoInput';
import { H4Text, H3Text, P3Text } from '../../../shared/components/Texts';
import AppColors from '../../../enums/AppColors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TxStep from '../../../enums/TxStep';
import OverlayLoading from '../../../shared/components/OverlayLoading';
import { useNavigation } from '@react-navigation/native';
import CryptoType from '../../../enums/CryptoType';
import { useTranslation } from 'react-i18next';
import PreferenceContext from '../../../contexts/PreferenceContext';
import PriceContext from '../../../contexts/PriceContext';

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
  estimateGas?: string
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
  estimateGas,
  setCurrent,
  setValues,
  createTx,
}) => {
  const navigation = useNavigation();
  const { currencyFormatter } = useContext(PreferenceContext)
  const { ethPrice } = useContext(PriceContext)
  const fromToRatio = fromPrice / toPrice;
  const fromMax = 100000;
  const toMax = 100000;
  const [state, setState] = useState({
    errorValue: 0
  });
  const { t } = useTranslation();

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
          <H4Text label={t('assets.cancel')} style={{ color: AppColors.MAIN }} />
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
              parseFloat(values.from || '0') * fromPrice,
              2,
            )}
          active={current === 'from'}
          onPress={() => setCurrent('from')}
        />
        <View>
          <Text style={{ textAlign: 'center', fontSize: 20, color: AppColors.MAIN, marginTop: 5, marginBottom: 5 }}>↓</Text>
          {state.errorValue === 1 && (
            <P3Text label={t('assets.not_enough_quantity')} style={{ fontSize: 10, right: 0, position: "absolute", color: AppColors.RED, marginTop: 3, marginBottom: 5 }} />
          )}
        </View>
        <CryptoInput
          title={toInputTitle}
          cryptoTitle={toTitle}
          cryptoType={toCrypto}
          style={{ marginBottom: estimateGas ? 10 : 30 }}
          value={values.to || '0'}
          active={current === 'to'}
          onPress={() => setCurrent('to')}
        />
        {!!estimateGas && <P3Text
          label={t('assets.transaction_fee', { 
            ethValue: estimateGas,
            usdValue: currencyFormatter(parseFloat(estimateGas) * ethPrice)
          })}
          style={{ textAlign: 'center', marginBottom: 10, top: 5, marginTop: 10 }}
        />}
        <View>
          {state.errorValue === 2 && (
            <P3Text label={t('assets.not_enough_values', { toTitle })} style={{ fontSize: 10, right: 0, position: "absolute", bottom: 25, color: AppColors.RED }} />
          )}
        </View>
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
            if (parseFloat(values.from) > fromMax) { // 최대 보유개수가 100,000개라고 가정
              setState({ ...state, errorValue: 1 });
            } else if (parseFloat(values.to) > toMax) { // 남은 ELA 토큰이 100개라고 가정
              setState({ ...state, errorValue: 2 });
            } else {
              setState({ ...state, errorValue: 0 });
              createTx()
            }
          }}
        />
      </View>
      <OverlayLoading visible={[TxStep.Approving, TxStep.CheckAllowance, TxStep.Creating].includes(step)} />
    </>
  )
}

export default TxInput;