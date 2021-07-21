import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import TxStep from '../../../enums/TxStep';
import OverlayLoading from '../../../shared/components/OverlayLoading';
import { useTranslation } from 'react-i18next';
import Asset from '../../../types/Asset';
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
  assetInCrypto: Asset
  assetInToken: Asset
  remainingSupplyInToken?: number
  remainingSupplyInCrypto?: number
  cryptoPrice: number
  tokenPrice: number
  balanceInCrypto: number
  balanceInToken: number
  values: { inFiat: string, inToken: string }
  current: string
  step: TxStep
  estimateGas?: string
  disabled: boolean
  isApproved: boolean
  setCurrent: Dispatch<SetStateAction<"token" | "fiat">>
  setValues: Dispatch<SetStateAction<{ inFiat: string; inToken: string; }>>
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
  assetInCrypto,
  assetInToken,
  remainingSupplyInCrypto,
  remainingSupplyInToken,
  cryptoPrice,
  tokenPrice,
  balanceInCrypto,
  balanceInToken,
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
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();
  const gasCrypto = [assetInCrypto.type, assetInToken.type].includes(CryptoType.BNB) ? CryptoType.BNB : CryptoType.ETH;
  const insets = useSafeAreaInsets();
  const valueInCrypto = parseFloat(values.inFiat) / getCryptoPrice(assetInCrypto.type);
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(assetInCrypto.type) ?
    balanceInCrypto < parseFloat(estimateGas) + valueInCrypto
    : balanceInCrypto < parseFloat(estimateGas);

  const isOverMax = [CryptoType.BNB, CryptoType.ETH].includes(assetInCrypto.type) ?
    valueInCrypto + parseFloat(estimateGas) > (remainingSupplyInCrypto ? Math.min(remainingSupplyInCrypto, balanceInCrypto) : balanceInCrypto)
    : valueInCrypto > (remainingSupplyInCrypto ? Math.min(remainingSupplyInCrypto, balanceInCrypto) : balanceInCrypto);

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={title} />
      <View style={{
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'center',
      }}>
        <TouchableOpacity
          onPress={() => setCurrent('token')}
          style={{
            backgroundColor: current === 'token' ? AppColors.MAIN : AppColors.WHITE,
            borderColor: current === 'token' ? AppColors.MAIN : AppColors.BLUISH_GREY,
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
              color: current === 'token' ? AppColors.WHITE : AppColors.DEACTIVATED,
              fontFamily: AppFonts.Regular,
            }}
          >
            {toInputTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrent('fiat')}
          style={{
            backgroundColor: current === 'fiat' ? AppColors.MAIN : AppColors.WHITE,
            borderColor: current === 'fiat' ? AppColors.MAIN : AppColors.BLUISH_GREY,
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
              color: current === 'fiat' ? AppColors.WHITE : AppColors.DEACTIVATED,
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
          flex: 1,
        }}>
        <TxInputViewer
          purpose={purpose}
          current={current}
          to={{
            value: values.inToken,
            type: assetInToken.unit,
            price: tokenPrice,
            max: remainingSupplyInToken ? Math.min(remainingSupplyInToken, balanceInToken) : balanceInToken,
          }}
          from={{
            value: values.inFiat,
            type: assetInCrypto.type,
            price: cryptoPrice,
            max: remainingSupplyInCrypto ? Math.min(remainingSupplyInCrypto, balanceInCrypto) : balanceInCrypto,
          }}
          isOverMax={isOverMax}
          estimatedGas={estimateGas}
          gasCrypto={gasCrypto}
          insufficientGas={insufficientGas}
        />
        <NumberPadShortcut
          current={current}
          values={current === 'token' ? [0.01, 1, 10, 100, 1000] : [10, 50, 100, 500, 1000]}
          inputValue={current === 'token' ? values.inToken : values.inFiat}
          setValues={setValues}
          ELAPrice={tokenPrice}
        />
        <NumberPad
          addValue={(text) => {
            const before = current === 'fiat' ? values.inFiat : values.inToken
            const includesComma = before.includes('.')
            if (
              text === '.' && includesComma
              || text !== '.' && !includesComma && before.length >= 12
              || includesComma && before.split('.')[1].length >= (current === 'fiat' ? 2 : 6)
              || before.split('').reduce((res, cur) => res && cur === '0', true) && text === '0'
            ) {
              return
            }

            const next = text === '.' && !before ? '0.' : text !== '0' && before === '0' ? text : before + text
            const removedDotNext = next[next.length - 1] === '.' ? next.slice(0, -1) : next;

            if (current === 'fiat') {
              setValues({
                inFiat: next,
                inToken: decimalFormatter(parseFloat(removedDotNext) / tokenPrice, 6),
              })
            } else {
              setValues({
                inFiat: decimalFormatter(parseFloat(removedDotNext) * tokenPrice, 2),
                inToken: next,
              })
            }
          }}
          removeValue={() => {
            const before = current === 'fiat' ? values.inFiat : values.inToken

            const next = before.slice(0, -1)

            if (current === 'fiat') {
              setValues({
                inFiat: next,
                inToken: decimalFormatter(parseFloat(next || '0') / tokenPrice, 6),
              })
            } else {
              setValues({
                inFiat: decimalFormatter(parseFloat(next || '0') * tokenPrice, 2),
                inToken: next,
              })
            }
          }}
          height={Dimensions.get('window').height - 440}
        />
      </View>
      <View
        style={{
          marginBottom: insets.bottom || 10,
          paddingLeft: '5%',
          paddingRight: '5%'
        }}
      >
        <NextButton
          disabled={isOverMax || disabled || insufficientGas}
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
        purpose={purpose}
        assetTitle={assetInToken.title}
        assetUnit={assetInToken.unit}
        values={values}
        priceInCryptocurrency={cryptoPrice}
        cryptocurrencyType={assetInCrypto.type}
        estimateGas={estimateGas}
        gasCrypto={gasCrypto}
        isApproved={isApproved}
        createTx={createTx}
      />
      <OverlayLoading visible={[TxStep.Approving, Platform.OS === 'android' && TxStep.CheckAllowance, TxStep.Creating].includes(step)} />
    </View>
  )
}

export default TxInput;