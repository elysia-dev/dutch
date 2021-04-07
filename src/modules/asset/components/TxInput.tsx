import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Text, View } from 'react-native';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import CryptoInput from '..//components/CryptoInput';
import { P3Text } from '../../../shared/components/Texts';
import AppColors from '../../../enums/AppColors';
import TxStep from '../../../enums/TxStep';
import OverlayLoading from '../../../shared/components/OverlayLoading';
import { useTranslation } from 'react-i18next';
import PreferenceContext from '../../../contexts/PreferenceContext';
import Asset from '../../../types/Asset';
import AssetContext from '../../../contexts/AssetContext';
import commaFormatter from '../../../utiles/commaFormatter';
import CryptoType from '../../../enums/CryptoType';
import PriceContext from '../../../contexts/PriceContext';
import SheetHeader from '../../../shared/components/SheetHeader';
import GasPrice from '../../../shared/components/GasPrice';

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
  const { currencyFormatter } = useContext(PreferenceContext)
  const { getBalance } = useContext(AssetContext);
  const fromToRatio = fromPrice / toPrice;
  const { t } = useTranslation();
  const isFromInvalid = parseFloat(values.from) > (from.value ? from.value : getBalance(from.unit));
  const isToInvalid = toMax ? (parseFloat(values.to) > toMax) : false;
  const gasCrypto = [from.type, to.type].includes(CryptoType.BNB) ? CryptoType.BNB : CryptoType.ETH;
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(from.type) ?
    getBalance(gasCrypto) < parseFloat(estimateGas) + parseFloat(values.from)
    : getBalance(gasCrypto) < parseFloat(estimateGas);

  return (
    <>
      <SheetHeader title={title} />
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
          balanceTitle={`${t('more_label.balance')}: ${commaFormatter(from.value ? from.value.toFixed(2) : getBalance(from.type).toFixed(2))} ${from.type}`}
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
        <GasPrice
          estimatedGas={estimateGas}
          gasCrypto={gasCrypto}
          insufficientGas={insufficientGas}
        />
        <View style={{ width: '100%', height: 1, marginTop: 0, marginBottom: 20, backgroundColor: AppColors.GREY }} />
        <NumberPad
          addValue={(text) => {
            const before = current === 'from' ? values.from : values.to
            if (
              text === '.' && before.includes('.')
              || before.length > 18
              || before.split('').reduce((res, cur) => res && cur === '0', true) && text === '0'
            ) {
              return
            }

            const next = text === '.' && !before ? '0.' : text !== '0' && before === '0' ? text : before + text
            const removedDotNext = next[next.length - 1] === '.' ? next.slice(0, -1) : next;

            if (current === 'from') {
              setValues({
                from: next,
                to: (parseFloat(removedDotNext) * fromToRatio).toFixed(2),
              })
            } else {
              setValues({
                from: (parseFloat(removedDotNext) / fromToRatio).toFixed(2),
                to: next,
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
          disabled={isToInvalid || isFromInvalid || disabled || insufficientGas}
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