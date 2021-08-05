import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButtonImg from '../../../shared/assets/images/backbutton.png';
import { H3Text, H4Text } from '../../../shared/components/Texts';
import HelpQuestionImg from '../../../shared/assets/images/HelpQuestion.png';
import CryptoType from '../../../enums/CryptoType';
import { utils } from 'ethers';
import { useContext } from 'react';
import PriceContext from '../../../contexts/PriceContext';
import AppColors from '../../../enums/AppColors';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AccelerateItem {
  isModalViasible: boolean;
  setIsModalViasible: (prev: boolean) => void;
  getEstimateGas: (text: string) => void;
  updateGasPrice: string;
  paymentMethod: CryptoType | 'NONE';
  valueInCryto: number;
  gasFee: string;
  crytoValue?: number;
  speedUp: () => void;
  isDisabled: boolean;
  setIsDisabled: (prev: boolean) => void;
  txCryptoType?: CryptoType;
}

const AccelerateModal: React.FC<AccelerateItem> = ({
  isModalViasible,
  setIsModalViasible,
  getEstimateGas,
  updateGasPrice,
  paymentMethod,
  valueInCryto,
  gasFee,
  crytoValue,
  speedUp,
  isDisabled,
  setIsDisabled,
  txCryptoType,
}) => {
  const { gasPrice, bscGasPrice } = useContext(PriceContext);
  const [isAssetDisabled, setIsAssetDisabled] = useState(false);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isCryptoBnb =
    paymentMethod === 'NONE'
      ? txCryptoType === CryptoType.BNB
      : paymentMethod === CryptoType.BNB;

  return (
    <Modal transparent={true} visible={isModalViasible} animationType="slide">
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 10 : '8%',
          borderRadius: 5,
          paddingLeft: 16,
          paddingRight: 16,
          marginTop: Platform.OS === 'android' ? 10 : 0,
          backgroundColor: '#FFFFFF',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: 20,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: -8,
            }}
            onPress={() => setIsModalViasible(false)}>
            <Image
              source={BackButtonImg}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </TouchableOpacity>
          <H3Text label={t('assets.accelerate')} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <H4Text label={t('assets.accelerate_gas_price')} />
          <Image style={{ width: 18, height: 18 }} source={HelpQuestionImg} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <TextInput
            style={{
              height: 51,
              width: '90%',
              borderColor: '#3679B5',
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              textAlign: 'right',
              padding: Platform.OS === 'android' ? 5 : 13,
              fontSize: 30,
            }}
            keyboardType="numeric"
            onChangeText={(text) => getEstimateGas(text)}
            value={updateGasPrice}
          />
          <View
            style={{
              width: '10%',
              borderColor: AppColors.MAIN,
              borderLeftColor: '#848484',
              borderWidth: 1,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}>
            <TouchableOpacity
              onPress={() =>
                getEstimateGas(String(Number(updateGasPrice) + 1))
              }>
              <View
                style={{
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderBottomColor: '#848484',
                    borderRightColor: 'transparent',
                    borderLeftColor: 'transparent',
                    borderRightWidth: 6,
                    borderLeftWidth: 6,
                    borderBottomWidth: 6,
                    marginBottom: 6,
                  }}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#848484',
                borderBottomWidth: 1,
              }}
            />
            <TouchableOpacity
              onPress={() =>
                getEstimateGas(String(Number(updateGasPrice) - 1))
              }>
              <View
                style={{
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderTopColor: '#848484',
                    borderRightColor: 'transparent',
                    borderLeftColor: 'transparent',
                    borderRightWidth: 6,
                    borderLeftWidth: 6,
                    borderTopWidth: 6,
                    marginTop: 6,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-end',
          }}>
          {Number(crytoValue) - Number(gasFee) < 0 ||
          (paymentMethod === 'NONE' &&
            valueInCryto + Number(gasFee) > Number(crytoValue)) ? (
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: AppColors.ERROR_RED,
              }}
              onLayout={() => setIsAssetDisabled(true)}>
              {t('assets.accelerate_insufficient')}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: AppColors.BLACK,
              }}
              onTextLayout={() => {
                if (
                  Number(updateGasPrice) <
                  Number(
                    utils.formatUnits(isCryptoBnb ? bscGasPrice : gasPrice, 9),
                  )
                ) {
                  setIsDisabled(true);
                  return;
                }
                setIsDisabled(false);
                setIsAssetDisabled(false);
              }}>
              {t('assets.accelerate_gas_fee')} : {gasFee}{' '}
              {isCryptoBnb ? CryptoType.BNB : CryptoType.ETH}
            </Text>
          )}
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
            }}>
            {parseFloat(
              utils.formatUnits(isCryptoBnb ? bscGasPrice : gasPrice, 9),
            )}{' '}
            {t('assets.accelerate_gas_fee_guide')}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#F1F1F1',
            marginTop: 10,
            marginBottom: 10,
          }}
        />
        <Text style={{ fontSize: 12, lineHeight: 20 }}>
          {t('assets.transaction_delay_guide')}
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: insets.bottom || 10,
            width: '100%',
            height: 50,
            borderRadius: 5,
            left: 16,
            backgroundColor:
              isDisabled || isAssetDisabled ? AppColors.GREY : AppColors.MAIN,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={isDisabled || isAssetDisabled}
          onPress={() => speedUp()}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: AppColors.WHITE,
              textAlign: 'center',
            }}>
            {t('assets.accelerate_send')}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AccelerateModal;
