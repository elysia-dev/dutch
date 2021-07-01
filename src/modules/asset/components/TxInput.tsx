import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, Modal } from 'react-native';
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
import NumberPadShortcut from './NumberPadShortcut';
import TxInputViewer from './TxInputViewer';
import UserContext from '../../../contexts/UserContext';

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
  const { isWalletUser } = useContext(UserContext);
  const fromToRatio = fromPrice / toPrice;
  const { t } = useTranslation();
  const isFromInvalid = parseFloat(values.from) > (from.value ? from.value : getBalance(from.unit));
  const isToInvalid = toMax ? (parseFloat(values.to) > toMax) : false;
  const gasCrypto = [from.type, to.type].includes(CryptoType.BNB) ? CryptoType.BNB : CryptoType.ETH;
  const insets = useSafeAreaInsets();
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(from.type) ?
    getBalance(gasCrypto) < parseFloat(estimateGas) + parseFloat(values.from)
    : getBalance(gasCrypto) < parseFloat(estimateGas);
  const [modalVisible, setModalVisible] = useState(false);

  let input;
  let shortcut;
  if (current === 'to') {
    input = (
      <TxInputViewer
        current={current}
        value={values.to}
        type={to.type}
        maxAmount={toMax}
        balance={to.value}
      />
    );
    shortcut = (
      <NumberPadShortcut
        current={current}
        values={[0.01, 1, 10, 100, 1000]}
        inputValue={values.to}
        setValues={setValues}
        fromToRatio={fromToRatio}
      />
    );
  } else {
    input = (
      <TxInputViewer
        current={current}
        value={values.from}
        type={from.type}
        maxAmount={0} // 이거 임시값임!! 나중에 계산해서 넣어야 함
        balance={from.value || getBalance(from.type)}
      />
    );
    shortcut = (
      <NumberPadShortcut
        current={current}
        values={[10, 50, 100, 500, 1000]}
        inputValue={values.from}
        setValues={setValues}
        fromToRatio={fromToRatio}
      />
    );
  }

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
          <Text style={{ color: current === 'to' ? 'white' : '#CCCCCC' }}>받는 지분</Text>
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
          <Text style={{ color: current === 'from' ? 'white' : '#CCCCCC' }}>금액 입력</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          height: Dimensions.get('window').height - 200,
        }}>
        {input}
        <GasPrice
          estimatedGas={estimateGas}
          gasCrypto={gasCrypto}
          insufficientGas={insufficientGas}
        />
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
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: 'lawngreen',
              width: '50%',
              height: '50%',
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
            >
              <Text>x (QuitIcon 쓸 것)</Text>
            </TouchableOpacity>
            <Text>{`투자 상품: ${to.title} (${to.type})`}</Text>
            <Text>{`투자 금액: ${values.from} ${from.type}`}</Text>
            <Text>{`매수량: ${values.to} ${to.type}`}</Text>
            <TouchableOpacity
              onPress={createTx}
            >
              <Text>정말구매할것입니다</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <OverlayLoading visible={[TxStep.Approving, TxStep.CheckAllowance, TxStep.Creating].includes(step)} />
    </View>
  )
}

export default TxInput;