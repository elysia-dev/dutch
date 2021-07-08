import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import PriceContext from '../../../contexts/PriceContext';
import CryptoType from '../../../enums/CryptoType';
import AppFonts from '../../../enums/AppFonts';

interface Props {
  purpose: string
  current: string
  to: {
    value: string, // 입력한 값
    type: string, // 화폐 단위
    maxAmount: number | undefined, // 최대 투자 가능 금액
    balance: number, // 잔고
    price: number, // 토큰당 현재 가격..?
  }
  from: {
    value: string, // 입력한 값
    type: string, // 화폐 단위
    maxAmount: number | undefined, // 최대 투자 가능 금액
    balance: number, // 잔고
    price: number, // 토큰당 현재 가격..?
  }
  isBalanceSufficient: boolean,
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
  isBalanceSufficient,
  isUnderMax,
  estimatedGas,
  gasCrypto,
  insufficientGas,
}) => {
  const { getCryptoPrice } = useContext(PriceContext);
  const { t } = useTranslation();

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
  if (currentTab.value) {
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
        <Text
          style={{
            fontSize: 30,
            color: '#1C1C1C',
            fontFamily: AppFonts.Bold,
          }}
        >
          {currentTab.value}
        </Text>
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
        {current === 'to' ? t(`assets.${purpose}_stake_placeholder`) : t(`assets.${purpose}_value_placeholder`)}
      </Text>
    );
  }

  let balanceText;
  if (currentTab.value) {
    if (isBalanceSufficient) {
      if (current === 'to') {
        balanceText = (
          <Text
            style={{
              textAlign: 'right',
              color: '#BABABA',
              fontSize: 12,
              fontFamily: AppFonts.Regular,
              width: '100%',
              marginTop: 4,
            }}
          >
            {`$ ${((Number(currentTab.value)) * 5).toFixed(2)} (= ${(Number(from.value) / from.price).toFixed(2)} ${from.type})`}
          </Text>
        );
      } else {
        balanceText = (
          <Text
            style={{
              textAlign: 'right',
              color: '#BABABA',
              fontSize: 12,
              fontFamily: AppFonts.Regular,
              width: '100%',
              marginTop: 4,
            }}
          >
            {`${(Number(currentTab.value) / 5).toFixed(2)} ${to.type} (= ${(Number(from.value) / from.price).toFixed(2)} ${from.type})`}
          </Text>
        );
      }
    } else {
      balanceText = (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            marginTop: 4,
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
            {t('assets.insufficient_balance', { type: from.type })}
          </Text>
        </View>
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
  const maxTextLabel = current === 'to' ? t(`assets.${purpose}_stake_available`) : t(`assets.${purpose}_value_available`);
  const maxTextValue = currentTab.balance.toFixed(2);
  if (isUnderMax) {
    maxText = (
      <Text
        style={{
          textAlign: 'right',
          color: '#BABABA',
          fontSize: 12,
          fontFamily: AppFonts.Regular,
        }}
      >
        {`${maxTextLabel}: ${maxTextValue} ${currentTab.type}`}
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
          {`${current === 'to' ? t(`assets.${purpose}_stake_excess`) : t(`assets.${purpose}_value_excess`)}`}
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
        color: '#BABABA',
        fontSize: 12,
        marginTop: 6,
        fontFamily: AppFonts.Regular,
      }}
      >
        {`${t('assets.gas_price')}: ${estimatedGas} ${gasCrypto}`}
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
        marginRight: 10,
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
      {/* <Text>{`잔고: ${currentTab.balance} ${currentTab.type}`}</Text> */}
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