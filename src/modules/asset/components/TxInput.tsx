import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import TxStep from '../../../enums/TxStep';
import OverlayLoading from '../../../shared/components/OverlayLoading';
import { useTranslation } from 'react-i18next';
import Asset from '../../../types/Asset';
import AssetContext from '../../../contexts/AssetContext';
import CryptoType from '../../../enums/CryptoType';
import SheetHeader from '../../../shared/components/SheetHeader';
import NumberPadShortcut from './NumberPadShortcut';
import TxInputViewer from './TxInputViewer';
import UserContext from '../../../contexts/UserContext';
import PriceContext from '../../../contexts/PriceContext';
import AppFonts from '../../../enums/AppFonts';
import decimalFormatter from '../../../utiles/decimalFormatter';
import ConfirmationModal from './ConfirmationModal';
import AppColors from '../../../enums/AppColors';
import PurposeType from '../../../enums/PurposeType';

interface ITxInput {
  purpose: PurposeType
  title: string
  fromInputTitle: string
  toInputTitle: string
  from: Asset
  to: Asset
  toMax?: number
  fromMax?: number
  fromPrice: number
  toPrice: number
  fromBalance: number
  toBalance: number
  values: { from: string, to: string }
  current: string
  step: TxStep
  estimateGas?: string
  disabled: boolean
  isApproved: boolean
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
  purpose,
  title,
  fromInputTitle,
  toInputTitle,
  from,
  to,
  fromMax,
  toMax,
  fromPrice,
  toPrice,
  fromBalance,
  toBalance,
  values,
  current,
  step,
  estimateGas = '0',
  disabled,
  isApproved,
  setCurrent,
  setValues,
  createTx,
}) => {
  const { getBalance } = useContext(AssetContext);
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();
  const gasCrypto = [from.type, to.type].includes(CryptoType.BNB) ? CryptoType.BNB : CryptoType.ETH;
  const insets = useSafeAreaInsets();
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(from.type) ?
    getBalance(gasCrypto) < parseFloat(estimateGas) + parseFloat(values.from) / getCryptoPrice(gasCrypto)
    : getBalance(gasCrypto) < parseFloat(estimateGas);
  const purposeType = purpose === PurposeType.Purchase ? 'invest' : 'refund';

  // 잔고도 충분하고 구매 가능한 토큰/금액도 충분한지? 둘 중에 더 작은 것과 비교함
  const isUnderToMax = parseFloat(values.to || '0') <= (toMax ? Math.min(toMax, toBalance) : toBalance);
  const isUnderFromMax = (parseFloat(values.from || '0') / getCryptoPrice(from.type)) <= (fromMax ? Math.min(fromMax, fromBalance) : fromBalance);
  const isUnderMax = current === 'to' ? isUnderToMax : isUnderFromMax;

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={title} />
      <View style={{
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'center',
      }}>
        <TouchableOpacity
          onPress={() => setCurrent('to')}
          style={{
            backgroundColor: current === 'to' ? AppColors.MAIN : AppColors.WHITE,
            borderColor: current === 'to' ? AppColors.MAIN : AppColors.BLUISH_GREY,
            borderWidth: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            width: '45%',
            height: 37,
          }}
        >
          <Text
            style={{
              color: current === 'to' ? AppColors.WHITE : AppColors.DEACTIVATED, //
              fontFamily: AppFonts.Regular,
            }}
          >
            {toInputTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrent('from')}
          style={{
            backgroundColor: current === 'from' ? AppColors.MAIN : AppColors.WHITE,
            borderColor: current === 'from' ? AppColors.MAIN : AppColors.BLUISH_GREY,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            width: '45%',
            height: 37,
          }}
        >
          <Text
            style={{
              color: current === 'from' ? AppColors.WHITE : AppColors.DEACTIVATED,
              fontFamily: AppFonts.Regular,
            }}
          >
            {fromInputTitle}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: Dimensions.get('window').height - 200,
        }}>
        <TxInputViewer
          purpose={purpose}
          current={current}
          to={{
            value: values.to,
            type: to.unit,
            price: toPrice,
            max: toMax ? Math.min(toMax, toBalance) : toBalance,
          }}
          from={{
            value: values.from,
            type: from.type,
            price: fromPrice,
            max: fromMax ? Math.min(fromMax, fromBalance) : fromBalance,
          }}
          isUnderMax={isUnderMax}
          estimatedGas={estimateGas}
          gasCrypto={gasCrypto}
          insufficientGas={insufficientGas}
        />
        <NumberPadShortcut
          current={current}
          values={current === 'to' ? [0.01, 1, 10, 100, 1000] : [10, 50, 100, 500, 1000]}
          inputValue={current === 'to' ? values.to : values.from}
          setValues={setValues}
          ELAPrice={toPrice}
        />
        <NumberPad
          addValue={(text) => {
            const before = current === 'from' ? values.from : values.to
            const includesComma = before.includes('.')
            if (
              text === '.' && includesComma
              || text !== '.' && !includesComma && before.length >= 12
              || includesComma && before.split('.')[1].length >= (current === 'from' ? 2 : 6)
              || before.split('').reduce((res, cur) => res && cur === '0', true) && text === '0'
            ) {
              return
            }

            const next = text === '.' && !before ? '0.' : text !== '0' && before === '0' ? text : before + text
            const removedDotNext = next[next.length - 1] === '.' ? next.slice(0, -1) : next;

            if (current === 'from') {
              setValues({
                from: next,
                to: decimalFormatter(parseFloat(removedDotNext) / toPrice, 6),
              })
            } else {
              setValues({
                from: decimalFormatter(parseFloat(removedDotNext) * toPrice, 2),
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
                to: decimalFormatter(parseFloat(next || '0') / toPrice, 6),
              })
            } else {
              setValues({
                from: decimalFormatter(parseFloat(next || '0') * toPrice, 2),
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
          disabled={!isUnderMax || disabled || insufficientGas}
          title={t('assets.done')}
          handler={() => {
            if (isWalletUser) {
              setModalVisible(true)
            } else {
              createTx()
            }
          }}
        />
      </View>
      <ConfirmationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={title}
        purposeType={purposeType}
        assetTitle={to.title}
        assetUnit={to.unit}
        values={values}
        priceInCryptocurrency={fromPrice}
        cryptocurrencyType={from.type}
        estimateGas={estimateGas}
        gasCrypto={gasCrypto}
        isApproved={isApproved}
        createTx={createTx}
        disabled={disabled}
      />
      <OverlayLoading visible={[TxStep.Approving, TxStep.CheckAllowance, TxStep.Creating].includes(step)} />
    </View>
  )
}

export default TxInput;