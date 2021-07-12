import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import CryptoType from '../../../enums/CryptoType';
import commaFormatter from '../../../utiles/commaFormatter';
import GuideText from './GuideText';
import GuideTextInvalid from './GuideTextInvalid';
import LargeTextInput from './LargeTextInput';

interface Props {
  purpose: string // invest / refund
  current: string
  to: {
    value: string, // 입력한 값
    type: string, // 화폐 단위
    price: number, // 토큰 가격
    max: number, // 사용자가 구매/환불 가능한 최대 토큰 개수
  }
  from: {
    value: string, // 입력한 값
    type: string, // 화폐 단위
    price: number, // 화폐 가격
    max: number, // 사용자가 구매/환불 가능한 최대 금액
  }
  isUnderMax: boolean,
  estimatedGas: string,
  gasCrypto: CryptoType,
  insufficientGas: boolean,
}

const TxInputViewer: React.FC<Props> = ({
  purpose,
  current,
  to,
  from,
  isUnderMax,
  estimatedGas,
  gasCrypto,
  insufficientGas,
}) => {
  const { t } = useTranslation();
  const purposeType = purpose === 'purchase' ? 'invest' : 'refund';
  const currentTab = current === 'to' ? to : from;

  let balanceText;
  if (currentTab.value) {
    if (current === 'to') {
      balanceText = (
        <GuideText
          text={`$ ${commaFormatter(((Number(currentTab.value)) * 5).toFixed(4))} (= ${commaFormatter((Number(from.value) / from.price).toFixed(2))} ${from.type})`}
          style={{
            width: '100%',
            marginTop: 4,
          }}
        />
      );
    } else {
      balanceText = (
        <GuideText
          text={`${commaFormatter((Number(currentTab.value) / 5).toFixed(2))} ${to.type} (= ${commaFormatter((Number(from.value) / from.price).toFixed(2))} ${from.type})`}
          style={{
            width: '100%',
            marginTop: 4,
          }}
        />
      );
    }
  } else {
    balanceText = (
      <View
        style={{
          width: '100%',
          height: 9,
        }}
      />
    );
  }

  let maxText;
  const maxTextLabel = current === 'to' ? t(`assets.${purposeType}_stake_available`) : t(`assets.${purposeType}_value_available`);
  const maxTextValue = currentTab.max.toFixed(current === 'to' ? 4 : 2);
  if (isUnderMax) {
    maxText = (
      <GuideText text={`${maxTextLabel}: ${commaFormatter(maxTextValue)} ${currentTab.type}`} />
    );
  } else {
    maxText = (
      <GuideTextInvalid text={`${current === 'to' ? t(`assets.${purposeType}_stake_excess`) : t(`assets.${purposeType}_value_excess`)}`} />
    );
  }

  let gasText;
  if (!insufficientGas) {
    gasText = (
      <GuideText
        text={`${t('assets.gas_price')}: ${commaFormatter(estimatedGas)} ${gasCrypto}`}
        style={{ marginTop: 6 }}
      />
    );
  } else {
    gasText = (
      <GuideTextInvalid text={t('assets.insufficient_gas')} style={{ marginTop: 5.5 }} />
    );
  }

  return (
    <View
      style={{
        marginTop: 40,
        marginBottom: 60,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <LargeTextInput
        current={current}
        value={currentTab.value}
        type={currentTab.type}
        purposeType={purposeType}
        tokenType={to.type}
        priceInCryptocurrency={commaFormatter((Number(from.value) / from.price).toFixed(2))}
        cryptocurrencyType={from.type}
      />
      <View
        style={{
          marginTop: 10,
          width: '100%',
          borderColor: '#E6E6E6',
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 12,
          paddingHorizontal: 10,
        }}
      >
        {maxText}
        {gasText}
      </View>
    </View>
  );
}

export default TxInputViewer;