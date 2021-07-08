import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
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
import NumberPadShortcut from './NumberPadShortcut';
import TxInputViewer from './TxInputViewer';
import UserContext from '../../../contexts/UserContext';
import { H3Text, H4Text } from '../../../shared/components/Texts';
import PriceContext from '../../../contexts/PriceContext';
import AppFonts from '../../../enums/AppFonts';

interface ITxInput {
  purpose: string
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
  toMax,
  fromPrice,
  toPrice,
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
  const { currencyFormatter } = useContext(PreferenceContext)
  const { getBalance } = useContext(AssetContext);
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();
  const gasCrypto = [from.type, to.type].includes(CryptoType.BNB) ? CryptoType.BNB : CryptoType.ETH;
  const insets = useSafeAreaInsets();
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(from.type) ?
    getBalance(gasCrypto) < parseFloat(estimateGas) + parseFloat(values.from) / getCryptoPrice(CryptoType.BNB)
    : getBalance(gasCrypto) < parseFloat(estimateGas);
  const purposeType = purpose === 'purchase' ? 'invest' : 'refund';

  let fromBalance = 0;
  let toBalance = 0;
  if (purpose === 'purchase') {
    fromBalance = getBalance(from.type);
    toBalance = fromBalance * fromPrice / toPrice;
  } else if (purpose === 'refund') {
    toBalance = to.value;
    fromBalance = toBalance * toPrice / fromPrice;
  }
  const isToBalanceSufficient = parseFloat(values.to || '0') <= toBalance;
  const isFromBalanceSufficient = parseFloat(values.from || '0') <= ((fromBalance) * fromPrice);
  const isUnderToMax = toMax ? (parseFloat(values.to || '0') <= (toMax || 0)) : false;
  const isUnderFromMax = toMax ? parseFloat(values.from || '0') <= ((toMax || 0) * toPrice) : false;

  let isBalanceSufficient = current === 'to' ? isToBalanceSufficient : isFromBalanceSufficient
  let isUnderMax = current === 'to' ? isUnderToMax : isUnderFromMax;

  // 구매를 할 때는 구매 가능한 최대 금액 != 잔고(내 지갑)임.
  // 하지만 환불을 할 때는 환불 가능한 최대 금액 = 잔고(내 투자금)임!!!!
  if (purpose === 'refund') {
    isUnderMax = isBalanceSufficient;
    isBalanceSufficient = true;
  }

  const isInvalid = !isBalanceSufficient || !isUnderMax;

  const input = (
    <TxInputViewer
      purpose={purpose}
      current={current}
      to={{
        value: values.to,
        type: to.unit,
        maxAmount: toMax,
        balance: toBalance,
        price: toPrice,
      }}
      from={{
        value: values.from,
        type: from.type,
        maxAmount: (toMax || 0) * 5 / getCryptoPrice(from.type),
        balance: fromBalance,
        price: fromPrice,
      }}
      isBalanceSufficient={isBalanceSufficient}
      isUnderMax={isUnderMax}
      estimatedGas={estimateGas}
      gasCrypto={gasCrypto}
      insufficientGas={insufficientGas}
    />
  );

  const shortcut = (
    <NumberPadShortcut
      current={current}
      values={current === 'to' ? [0.01, 1, 10, 100, 1000] : [10, 50, 100, 500, 1000]}
      inputValue={current === 'to' ? values.to : values.from}
      setValues={setValues}
      ELAPrice={toPrice}
    />
  );

  return (
    <View style={{ backgroundColor: '#fff', height: '100%' }}>
      <SheetHeader title={title} />
      <View style={{
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'center',
      }}>
        <TouchableOpacity
          onPress={() => setCurrent('to')}
          style={{
            backgroundColor: current === 'to' ? '#3679B5' : 'white',
            borderColor: current === 'to' ? '#3679B5' : '#E6ECF2',
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
              color: current === 'to' ? 'white' : '#CCCCCC',
              fontFamily: AppFonts.Regular,
            }}
          >
            {toInputTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrent('from')}
          style={{
            backgroundColor: current === 'from' ? '#3679B5' : 'white',
            borderColor: current === 'from' ? '#3679B5' : '#E6ECF2',
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
              color: current === 'from' ? 'white' : '#CCCCCC',
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
        {input}
        {shortcut}
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
                to: (parseFloat(removedDotNext) / toPrice).toFixed(2),
              })
            } else {
              setValues({
                from: (parseFloat(removedDotNext) * toPrice).toFixed(2),
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
                to: (parseFloat(next || '0') / toPrice).toFixed(2),
              })
            } else {
              setValues({
                from: (parseFloat(next || '0') * toPrice).toFixed(2),
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
          disabled={isInvalid || disabled || insufficientGas}
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
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType={'slide'}
      >
        <View
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.44)',
            }}
          />
          <View
            style={{
              width: '100%',
              height: 572,
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.44)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: AppColors.BACKGROUND_GREY,
                padding: 20,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <H4Text label={t('assets.cancel')} style={{ color: AppColors.MAIN }} />
              </TouchableOpacity>
              <H3Text label={title} style={{}} />
              <View style={{ width: 20 }} />
            </View>
            <View
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: 18,
                flex: 1,
                backgroundColor: 'white',
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'rgba(28, 28, 28, 1)',
                    textAlign: 'center',
                    lineHeight: 32,
                    fontWeight: 'bold',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(241, 241, 241, 1)',
                    alignItems: 'center',
                    marginTop: 20,
                    height: 50,
                    fontFamily: AppFonts.Bold,
                  }}
                >
                  {t(`assets.${purposeType}_confirm`)}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(241, 241, 241, 1)',
                    alignItems: 'center',
                    height: 50,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'rgba(102, 102, 102, 1)',
                      marginLeft: 5,
                      fontFamily: AppFonts.Regular,
                    }}
                  >
                    {t(`assets.${purposeType}_confirm_product`)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#1C1C1C',
                      marginRight: 5,
                      fontFamily: AppFonts.Bold,
                    }}
                  >
                    {to.title}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(241, 241, 241, 1)',
                    alignItems: 'center',
                    height: 64,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'rgba(102, 102, 102, 1)',
                      marginLeft: 5,
                      fontFamily: AppFonts.Regular,
                    }}
                  >
                    {t(`assets.${purposeType}_confirm_value`)}
                  </Text>
                  <View style={{ marginRight: 5 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#1C1C1C',
                        textAlign: 'right',
                        fontFamily: AppFonts.Bold,
                      }}
                    >
                      {`$ ${values.from}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#848484',
                        textAlign: 'right',
                        fontFamily: AppFonts.Regular,
                      }}
                    >
                      {`${(Number(values.from) / fromPrice).toFixed(2)} ${from.type}`}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(241, 241, 241, 1)',
                    alignItems: 'center',
                    height: 50,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'rgba(102, 102, 102, 1)',
                      marginLeft: 5,
                      fontFamily: AppFonts.Regular,
                    }}
                  >
                    {t(`assets.${purposeType}_confirm_stake`)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#1C1C1C',
                      marginRight: 5,
                      fontFamily: AppFonts.Bold,
                    }}
                  >
                    {`${values.to} ${to.unit}`}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(241, 241, 241, 1)',
                    alignItems: 'center',
                    height: 50,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'rgba(102, 102, 102, 1)',
                      marginLeft: 5,
                      fontFamily: AppFonts.Regular,
                    }}
                  >
                    {t('assets.gas_price')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#1C1C1C',
                      marginRight: 5,
                      fontFamily: AppFonts.Bold,
                    }}
                  >
                    {`${estimateGas} ${gasCrypto}`}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#1C1C1C',
                    marginHorizontal: 5,
                    marginTop: 12,
                    lineHeight: 20,
                    fontFamily: AppFonts.Regular,
                  }}
                >
                  {`* ${t('assets.confirm_gas')}`}
                </Text>
              </View>
              <View>
                {!isApproved && <Text
                  style={{
                    fontSize: 12,
                    color: '#1C1C1C',
                    marginHorizontal: 5,
                    marginBottom: 12,
                    lineHeight: 20,
                    fontFamily: AppFonts.Bold,
                  }}
                >
                  {`* ${t('assets.check_allowance_guide')}`}
                </Text>}
                <TouchableOpacity
                  onPress={createTx}
                  style={{
                    backgroundColor: disabled ? AppColors.GREY : AppColors.MAIN,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignContent: 'center',
                    height: 50,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      fontFamily: AppFonts.Bold,
                      color: 'white',
                    }}
                    allowFontScaling={false}
                  >
                    {isApproved ? t(`assets.${purposeType}`) : t('assets.check_allowance')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <OverlayLoading visible={[TxStep.Approving, TxStep.CheckAllowance, TxStep.Creating].includes(step)} />
    </View>
  )
}

export default TxInput;