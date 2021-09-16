import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import NumberPad from '../../../shared/components/NumberPad';
import NextButton from '../../../shared/components/NextButton';
import TxStep from '../../../enums/TxStep';
import Asset from '../../../types/Asset';
import CryptoType from '../../../enums/CryptoType';
import SheetHeader from '../../../shared/components/SheetHeader';
import NumberPadShortcut from './NumberPadShortcut';
import TxInputViewer from './TxInputViewer';
import UserContext from '../../../contexts/UserContext';
import PriceContext from '../../../contexts/PriceContext';
import AppFonts from '../../../enums/AppFonts';
import decimalFormatter from '../../../utiles/decimalFormatter';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import AppColors from '../../../enums/AppColors';
import PurposeType from '../../../enums/PurposeType';
import commaFormatter from '../../../utiles/commaFormatter';
import isNumericStringAppendable from '../../../utiles/isNumericStringAppendable';
import newInputValueFormatter from '../../../utiles/newInputValueFormatter';

interface ITxInput {
  purpose: PurposeType;
  title: string;
  fiatInputTitle: string;
  tokenInputTitle: string;
  assetInCrypto: Asset;
  assetInToken: Asset;
  remainingSupplyInToken?: number;
  remainingSupplyInCrypto?: number;
  cryptoPrice: number;
  tokenPrice: number;
  balanceInCrypto: number;
  balanceInToken: number;
  values: { inFiat: string; inToken: string };
  isMax: boolean;
  setIsMax: Dispatch<SetStateAction<boolean>>;
  current: string;
  step: TxStep;
  estimatedGas: string;
  disabled: boolean;
  isApproved: boolean;
  setCurrent: Dispatch<SetStateAction<'token' | 'fiat'>>;
  setValues: Dispatch<SetStateAction<{ inFiat: string; inToken: string }>>;
  approve: () => void;
  isLoading: boolean;
  approvalGasPrice?: string;
  createTx: () => void;
  isRefund?: PurposeType;
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
  fiatInputTitle,
  tokenInputTitle,
  assetInCrypto,
  assetInToken,
  remainingSupplyInCrypto,
  remainingSupplyInToken,
  cryptoPrice,
  tokenPrice,
  balanceInCrypto,
  balanceInToken,
  values,
  isMax,
  setIsMax,
  current,
  step,
  estimatedGas = '0',
  disabled,
  isApproved,
  setCurrent,
  setValues,
  approve,
  isLoading,
  approvalGasPrice,
  createTx,
  isRefund,
}) => {
  const { isWalletUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();
  const gasCrypto = [assetInCrypto.type, assetInToken.type].includes(
    CryptoType.BNB,
  )
    ? CryptoType.BNB
    : CryptoType.ETH;
  const insets = useSafeAreaInsets();
  const valueInCrypto =
    parseFloat(values.inFiat) / getCryptoPrice(assetInCrypto.type);
  const insufficientGas = [CryptoType.BNB, CryptoType.ETH].includes(
    assetInCrypto.type,
  )
    ? balanceInCrypto < parseFloat(estimatedGas) + valueInCrypto
    : balanceInCrypto < parseFloat(estimatedGas);

  const maxValueInToken = remainingSupplyInToken
    ? Math.min(remainingSupplyInToken, balanceInToken)
    : balanceInToken;
  const maxValueInCrypto = remainingSupplyInCrypto
    ? Math.min(remainingSupplyInCrypto, balanceInCrypto)
    : balanceInCrypto;
  const maxValueInFiat = remainingSupplyInCrypto
    ? Math.min(remainingSupplyInCrypto, balanceInCrypto) *
      getCryptoPrice(assetInCrypto.type)
    : balanceInCrypto * getCryptoPrice(assetInCrypto.type);

  const [estimateGas, setEstimateGas] = useState('');
  const isOverMax = [CryptoType.BNB, CryptoType.ETH].includes(
    assetInCrypto.type,
  )
    ? valueInCrypto + parseFloat(estimateGas) > maxValueInCrypto
    : isMax
    ? false
    : valueInCrypto > maxValueInCrypto;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (estimateGas) return;
    setEstimateGas(estimatedGas);
  }, [estimatedGas]);

  const isEthOrBnb = [CryptoType.ETH, CryptoType.BNB].includes(
    assetInCrypto.type,
  );

  return (
    <View style={{ backgroundColor: AppColors.WHITE, height: '100%' }}>
      <SheetHeader title={title} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => setCurrent('token')}
          style={{
            backgroundColor:
              current === 'token' ? AppColors.MAIN : AppColors.WHITE,
            borderColor:
              current === 'token' ? AppColors.MAIN : AppColors.BLUISH_GREY,
            borderWidth: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            width: '45%',
            height: 37,
          }}>
          <Text
            style={{
              color:
                current === 'token' ? AppColors.WHITE : AppColors.DEACTIVATED,
              fontFamily: AppFonts.Regular,
            }}>
            {tokenInputTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrent('fiat')}
          style={{
            backgroundColor:
              current === 'fiat' ? AppColors.MAIN : AppColors.WHITE,
            borderColor:
              current === 'fiat' ? AppColors.MAIN : AppColors.BLUISH_GREY,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            width: '45%',
            height: 37,
          }}>
          <Text
            style={{
              color:
                current === 'fiat' ? AppColors.WHITE : AppColors.DEACTIVATED,
              fontFamily: AppFonts.Regular,
            }}>
            {fiatInputTitle}
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
          dataInToken={{
            value: values.inToken,
            type: assetInToken.unit,
            price: tokenPrice,
            max: maxValueInToken,
          }}
          dataInFiat={{
            value: values.inFiat,
            type: assetInCrypto.type,
            price: cryptoPrice,
            max: maxValueInFiat,
          }}
          isOverMax={isOverMax}
          estimatedGas={estimateGas}
          gasCrypto={gasCrypto}
          insufficientGas={insufficientGas}
          isMax={isMax}
        />
        <NumberPadShortcut
          current={current}
          values={
            current === 'token'
              ? [0.01, 1, 10, 100, isEthOrBnb ? 1000 : 'max']
              : [10, 50, 100, 500, isEthOrBnb ? 1000 : 'max']
          }
          inputValue={current === 'token' ? values.inToken : values.inFiat}
          setValues={setValues}
          ELAPrice={tokenPrice}
          maxValueInToken={maxValueInToken}
          maxValueInFiat={maxValueInFiat}
          setIsMax={setIsMax}
        />
        <NumberPad
          addValue={(text) => {
            const before = current === 'fiat' ? values.inFiat : values.inToken;
            const maxFraction = current === 'fiat' ? 2 : 6;
            if (!isNumericStringAppendable(before, text, 12, maxFraction)) {
              return;
            }
            const next = newInputValueFormatter(before, text);
            const removedDotNext =
              next[next.length - 1] === '.' ? next.slice(0, -1) : next;

            if (current === 'fiat') {
              setValues({
                inFiat: next,
                inToken: decimalFormatter(
                  parseFloat(removedDotNext) / tokenPrice,
                  6,
                ),
              });
            } else {
              setValues({
                inFiat: decimalFormatter(
                  parseFloat(removedDotNext) * tokenPrice,
                  2,
                ),
                inToken: next,
              });
            }
            setIsMax(false);
          }}
          removeValue={() => {
            const before = current === 'fiat' ? values.inFiat : values.inToken;

            const next = before.slice(0, -1);

            if (current === 'fiat') {
              setValues({
                inFiat: next,
                inToken: decimalFormatter(
                  parseFloat(next || '0') / tokenPrice,
                  6,
                ),
              });
            } else {
              setValues({
                inFiat: decimalFormatter(
                  parseFloat(next || '0') * tokenPrice,
                  2,
                ),
                inToken: next,
              });
            }
            setIsMax(false);
          }}
          height={Dimensions.get('window').height - 440}
        />
      </View>
      <View
        style={{
          marginBottom: insets.bottom || 10,
          paddingLeft: '5%',
          paddingRight: '5%',
        }}>
        <NextButton
          disabled={isOverMax || disabled || insufficientGas}
          title={t('assets.done')}
          handler={() => {
            if (isWalletUser) {
              setModalVisible(true);
            } else {
              createTx();
            }
          }}
        />
      </View>
      <ConfirmationModal
        modalVisible={isVisible ? false : modalVisible}
        setModalVisible={setModalVisible}
        title={title}
        subtitle={t(`assets.${purpose}_confirm`)}
        list={[
          {
            label: t(`assets.${purpose}_confirm_product`),
            value: `${assetInToken.title} (${assetInToken.unit})`,
          },
          {
            label: t(`assets.${purpose}_confirm_value`),
            value: `$ ${commaFormatter(values.inFiat)}`,
            subvalue: `${commaFormatter(
              decimalFormatter(Number(values.inFiat) / cryptoPrice, 2),
            )} ${assetInCrypto.type}`,
          },
          {
            label: t(`assets.${purpose}_confirm_stake`),
            value: `${commaFormatter(values.inToken)} ${assetInToken.unit}`,
          },
          {
            label: t('assets.gas_price'),
            value: estimateGas
              ? `${commaFormatter(
                  decimalFormatter(parseFloat(estimateGas), 6),
                )} ${gasCrypto}`
              : t('assets.cannot_estimate_gas'),
          },
        ]}
        isApproved={isApproved}
        isLoading={isLoading}
        approvalGasPrice={approvalGasPrice || ''}
        assetTypeOrRefund={isRefund || assetInCrypto.type}
        submitButtonText={t(`assets.${purpose}`)}
        handler={isApproved ? createTx : approve}
      />
    </View>
  );
};

export default TxInput;
