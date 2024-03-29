import React from 'react';
import { View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../../enums/CryptoType';
import commaFormatter from '../../../utiles/commaFormatter';
import GuideText from '../../../shared/components/GuideText';
import GuideTextInvalid from '../../../shared/components/GuideTextInvalid';
import LargeTextInput from './LargeTextInput';
import AppColors from '../../../enums/AppColors';
import PurposeType from '../../../enums/PurposeType';
import decimalFormatter from '../../../utiles/decimalFormatter';

interface Props {
  purpose: PurposeType;
  current: string;
  dataInToken: {
    value: string; // 입력한 값
    type: string; // 화폐 단위
    price: number; // 토큰 가격
    max: number; // 사용자가 구매/환불 가능한 최대 토큰 개수
  };
  dataInFiat: {
    value: string; // 입력한 값
    type: string; // 화폐 단위
    price: number; // 화폐 가격
    max: number; // 사용자가 구매/환불 가능한 최대 금액
  };
  isOverMax: boolean;
  estimatedGas: string;
  gasCrypto: CryptoType;
  insufficientGas: boolean;
  isMax: boolean;
}

const TxInputViewer: React.FC<Props> = ({
  purpose,
  current,
  dataInToken,
  dataInFiat,
  isOverMax,
  estimatedGas,
  gasCrypto,
  insufficientGas,
  isMax,
}) => {
  const { t } = useTranslation();
  const currentTab = current === 'token' ? dataInToken : dataInFiat;
  const maxLabel =
    current === 'token'
      ? t(`assets.${purpose}_stake_available`)
      : t(`assets.${purpose}_value_available`);
  const maxValue =
    current === 'token'
      ? currentTab.max.toFixed(4)
      : (currentTab.max / currentTab.price).toFixed(2);

  return (
    <View
      style={{
        marginTop: Platform.OS === 'android' ? 40 : 20,
        marginBottom: Platform.OS === 'android' ? 60 : 30,
        display: 'flex',
        alignItems: 'center',
      }}>
      <LargeTextInput
        current={current}
        value={currentTab.value}
        type={currentTab.type}
        purpose={purpose}
        tokenType={dataInToken.type}
        valueInCryptocurrency={commaFormatter(
          isMax
            ? (dataInFiat.max / dataInFiat.price).toFixed(2)
            : (Number(dataInFiat.value) / dataInFiat.price).toFixed(2),
        )}
        cryptocurrencyType={dataInFiat.type}
        isMax={isMax}
        maxValueInToken={dataInToken.max}
        maxValueInFiat={dataInFiat.max}
      />
      <View
        style={{
          marginTop: 10,
          width: '100%',
          borderColor: AppColors.SUB_GREY,
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 12,
          paddingHorizontal: 10,
        }}>
        {isOverMax ? (
          <GuideTextInvalid
            text={`${
              current === 'token'
                ? t(`assets.${purpose}_stake_excess`)
                : t(`assets.${purpose}_value_excess`)
            }`}
          />
        ) : (
          <GuideText
            text={`${maxLabel}: ${commaFormatter(maxValue)} ${currentTab.type}`}
          />
        )}
        {insufficientGas ? (
          <GuideTextInvalid
            text={t('assets.insufficient_gas')}
            style={{ marginTop: 5.5 }}
          />
        ) : estimatedGas ? (
          <GuideText
            text={`${t('assets.gas_price')}: ${commaFormatter(
              decimalFormatter(parseFloat(estimatedGas), 6),
            )} ${gasCrypto}`}
            style={{ marginTop: 6 }}
          />
        ) : (
          // 빈 문자열이면
          <GuideText
            text={t('assets.cannot_estimate_gas')}
            style={{ marginTop: 6 }}
          />
        )}
      </View>
    </View>
  );
};

export default TxInputViewer;
