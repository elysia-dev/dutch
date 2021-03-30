import React, { Dispatch, SetStateAction, useContext } from 'react';
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
import { useTranslation } from 'react-i18next';
import PreferenceContext from '../../../contexts/PreferenceContext';
import Asset from '../../../types/Asset';
import AssetContext from '../../../contexts/AssetContext';
import commaFormatter from '../../../utiles/commaFormatter';
import CryptoType from '../../../enums/CryptoType';

interface ITxInput {
  title: string
  fromInputTitle: string
  toInputTitle: string
  from: Asset
  to: Asset
  toMax?: number
  fromPrice: number
  toPrice: number
  values: { from: string, to: string }
  current: string
  step: TxStep
  estimateGas?: string
  disabled: boolean
  setCurrent: Dispatch<SetStateAction<"from" | "to">>
  setValues: Dispatch<SetStateAction<{ from: string; to: string; }>>
  createTx: () => void
}

const TxInput: React.FC<ITxInput> = ({
  title,
  fromInputTitle,
  toInputTitle,
  from,
  to,
  toMax,
  fromPrice,
  toPrice,
  values,
  current,
  step,
  estimateGas = '0',
  disabled,
  setCurrent,
  setValues,
  createTx,
}) => {
  const navigation = useNavigation();
  const { currencyFormatter } = useContext(PreferenceContext)
  const { getBalance } = useContext(AssetContext);
  const fromToRatio = fromPrice / toPrice;
  const { t } = useTranslation();
  const isFromInvalid = parseFloat(values.from) > (from.unitValue ? from.unitValue : getBalance(from.unit));
  const isToInvalid = toMax ? (parseFloat(values.to) > toMax) : false;
  const insufficientBalance = [CryptoType.BNB, CryptoType.ETH].includes(from.type) ?
    getBalance(from.type) < parseFloat(estimateGas) + parseFloat(values.from)
    : getBalance(to.type) < parseFloat(estimateGas);

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
          cryptoTitle={from.title}
          cryptoType={from.type}
          balanceTitle={`${t('more_label.balance')}: ${commaFormatter(from.unitValue ? from.unitValue.toFixed(2) : getBalance(from.type).toFixed(2))} ${from.type}`}
          invalid={isFromInvalid}
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
        </View>
        <CryptoInput
          title={toInputTitle}
          cryptoTitle={to.title}
          cryptoType={to.type}
          balanceTitle={toMax ? `${t('product_label.available_token')}: ${toMax} ${to.type}` : ''}
          invalid={isToInvalid}
          style={{ marginBottom: estimateGas ? 10 : 30 }}
          value={values.to || '0'}
          active={current === 'to'}
          onPress={() => setCurrent('to')}
        />
        {
          !!estimateGas && <>
            <P3Text
              label={`${t('assets.transaction_fee')}: ${estimateGas} ${from.unit} (${currencyFormatter(parseFloat(estimateGas) * fromPrice)})`}
              style={{ textAlign: 'center', marginBottom: insufficientBalance ? 5 : 10 }}
            />
            <View>
              {insufficientBalance && (
                <Text style={{ fontSize: 10, right: 0, color: AppColors.RED, textAlign: 'center', marginBottom: 5 }}> {t('assets.insufficient_eth', { crypto: from.type })} </Text>
              )}
            </View>
          </>
        }
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
          disabled={isToInvalid || isFromInvalid || disabled || insufficientBalance}
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