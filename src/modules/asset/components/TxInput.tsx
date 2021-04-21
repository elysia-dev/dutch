import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import CryptoInput from '..//components/CryptoInput';
import AppColors from '../../../enums/AppColors';
import TxStep from '../../../enums/TxStep';
import OverlayLoading from '../../../shared/components/OverlayLoading';
import { useTranslation } from 'react-i18next';
import PreferenceContext from '../../../contexts/PreferenceContext';
import Asset from '../../../types/Asset';
import AssetContext from '../../../contexts/AssetContext';
import commaFormatter from '../../../utiles/commaFormatter';
import CryptoType from '../../../enums/CryptoType';
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

// * Info
// Tricky Height Calculations!
// Why? NumberPad의 높이를 기기마다 넉넉하게 해주기 위함
// flex는 쓸쑤 없는가?
// -> OS 마다 sheet modal 지원 여부, 기기 마다 다른 하단 값 등을 변수가 많기 때문에 flex를 사용하기 보다 직접 계산해주는 게 훨씬 쉬움
// Sheet Header Height = 200
// Bottom Button Height = 50
// TxInput Height ~= 200
// -> NumberPad Height = Window.height - 440
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
  const insets = useSafeAreaInsets();
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(from.type) ?
    getBalance(gasCrypto) < parseFloat(estimateGas) + parseFloat(values.from)
    : getBalance(gasCrypto) < parseFloat(estimateGas);

  return (
    <View style={{ backgroundColor: '#fff', height: '100%' }}>
      <SheetHeader title={title} />
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: Dimensions.get('window').height - 200,
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
          height={Dimensions.get('window').height - 440}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: insets.bottom || 10,
          paddingLeft: '5%',
          paddingRight: '5%'
        }}
      >
        <NextButton
          disabled={isToInvalid || isFromInvalid || disabled || insufficientGas}
          title={title}
          handler={() => {
            createTx()
          }}
        />
      </View>
      <OverlayLoading visible={[TxStep.Approving, TxStep.CheckAllowance, TxStep.Creating].includes(step)} />
    </View>
  )
}

export default TxInput;