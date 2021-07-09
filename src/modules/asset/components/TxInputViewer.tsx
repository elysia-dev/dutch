import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import PriceContext from '../../../contexts/PriceContext';
import CryptoType from '../../../enums/CryptoType';
import AppFonts from '../../../enums/AppFonts';
import commaFormatter from '../../../utiles/commaFormatter';

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
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();
  const purposeType = purpose === 'purchase' ? 'invest' : 'refund';

  let currentTab;
  let otherTab;
  if (current === 'to') {
    currentTab = to;
    otherTab = from;
  } else {
    currentTab = from;
    otherTab = to;
  }

  let valueText;
  let valueFontSize = 30;
  if (currentTab.value) {
    if (currentTab.value.length > 10) {
      valueFontSize = valueFontSize - (currentTab.value.length-10);
    }

    valueText = (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: current === 'to' ? 'flex-end' : 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {current === 'from' && <Text
          style={{
            fontSize: 25,
            color: '#666666',
            fontFamily: AppFonts.Bold,
          }}
        >
          $
        </Text>}
        <View
          style={{
            height: 41.8,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Text
            style={{
              fontSize: valueFontSize,
              color: '#1C1C1C',
              fontFamily: AppFonts.Bold,
            }}
          >
            {commaFormatter(currentTab.value)}
          </Text>
        </View>
        {current === 'to' && <Text
          style={{
            fontSize: 25,
            color: '#666666',
            fontFamily: AppFonts.Bold,
          }}
        >
          {' ' + currentTab.type}
        </Text>}
      </View>
    );
  } else {
    valueText = (
      <Text
        style={{
          fontSize: 30,
          textAlign: 'center',
          color: '#CCCCCC',
          fontFamily: AppFonts.Medium,
          marginTop: currentTab.value ? 0 : 12,
        }}
      >
        {current === 'to' ? t(`assets.${purposeType}_stake_placeholder`) : t(`assets.${purposeType}_value_placeholder`)}
      </Text>
    );
  }

  let balanceText;
  if (currentTab.value) {
    if (current === 'to') {
      balanceText = (
        <Text
          style={{
            textAlign: 'right',
            color: '#848484',
            fontSize: 12,
            fontFamily: AppFonts.Regular,
            width: '100%',
            marginTop: 4,
          }}
        >
          {`$ ${commaFormatter(((Number(currentTab.value)) * 5).toFixed(4))} (= ${commaFormatter((Number(from.value) / from.price).toFixed(2))} ${from.type})`}
        </Text>
      );
    } else {
      balanceText = (
        <Text
          style={{
            textAlign: 'right',
            color: '#848484',
            fontSize: 12,
            fontFamily: AppFonts.Regular,
            width: '100%',
            marginTop: 4,
          }}
        >
          {`${commaFormatter((Number(currentTab.value) / 5).toFixed(2))} ${to.type} (= ${commaFormatter((Number(from.value) / from.price).toFixed(2))} ${from.type})`}
        </Text>
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
      <Text
        style={{
          textAlign: 'right',
          color: '#848484',
          fontSize: 12,
          fontFamily: AppFonts.Regular,
        }}
      >
        {`${maxTextLabel}: ${commaFormatter(maxTextValue)} ${currentTab.type}`}
      </Text>
    );
  } else {
    maxText = (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Image
          source={require('../images/alert_icon_xxhdpi.png')}
          style={{
            width: 15,
            height: 15,
            marginRight: 3,
          }}
        />
        <Text
          style={{
            textAlign: 'right',
            color: '#E53935',
            fontSize: 12,
            fontFamily: AppFonts.Medium,
          }}
        >
          {`${current === 'to' ? t(`assets.${purposeType}_stake_excess`) : t(`assets.${purposeType}_value_excess`)}`}
        </Text>
      </View>
    );
  }

  let gasText;
  if (!insufficientGas) {
    gasText = (
      <Text
      style={{
        textAlign: 'right',
        color: '#848484',
        fontSize: 12,
        marginTop: 6,
        fontFamily: AppFonts.Regular,
      }}
      >
        {`${t('assets.gas_price')}: ${commaFormatter(estimatedGas)} ${gasCrypto}`}
      </Text>
    );
  } else {
    gasText = (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          marginTop: 6,
        }}
      >
        <Image
          source={require('../images/alert_icon_xxhdpi.png')}
          style={{
            width: 15,
            height: 15,
            marginRight: 3,
          }}
        />
        <Text
          style={{
            textAlign: 'right',
            color: '#E53935',
            fontSize: 12,
            fontFamily: AppFonts.Medium,
          }}
        >
          {t('assets.insufficient_gas')}
        </Text>
      </View>
    );
  }

  const guideText = (
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
  );

  return (
    <View
      style={{
        marginTop: 40,
        marginBottom: 60,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {valueText}
      {balanceText}
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: '#3679B5',
          width: '100%',
          marginTop: 12,
        }}
      />
      {guideText}
    </View>
  );
}

export default TxInputViewer;