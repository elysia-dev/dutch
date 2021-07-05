import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { max } from 'react-native-reanimated';
import PriceContext from '../../../contexts/PriceContext';
import CryptoType from '../../../enums/CryptoType';
import AppFonts from '../../../enums/AppFonts';

interface Props {
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
}

const TxInputViewer: React.FC<Props> = ({
  current,
  to,
  from,
  isBalanceSufficient,
  isUnderMax,
}) => {
  const { getCryptoPrice } = useContext(PriceContext);

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
        }}
      >
        {current === 'to' ? '몇 개를 구매할까요?' : '얼마를 구매할까요?'}
      </Text>
    );
  }

  let balanceText;
  if (isBalanceSufficient) {
    if (current === 'to') {
      balanceText = (
        <Text
          style={{
            textAlign: 'right',
            color: '#BABABA',
            fontSize: 12,
            fontFamily: AppFonts.Regular,
          }}
        >
          {`투자 금액: $ ${((Number(currentTab.value)) * 5).toFixed(2)} (= ${(Number(from.value) * getCryptoPrice(CryptoType.EL)).toFixed(2)} EL)`}
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
          }}
        >
          {`구매량: ${(Number(currentTab.value) / currentTab.price).toFixed(2)} ${currentTab.type} (= ${(Number(from.value) * getCryptoPrice(CryptoType.EL)).toFixed(2)} EL)`}
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
          보유하신 EL 잔액이 부족합니다.
        </Text>
      </View>
    );
  }

  let maxText;
  if (isUnderMax) {
    maxText = (
      <Text
        style={{
          textAlign: 'right',
          color: '#BABABA',
          fontSize: 12,
          marginTop: 4,
          fontFamily: AppFonts.Regular,
        }}
      >
        {`${current === 'to' ? '투자 가능 토큰 수량' : '투자 가능 금액'}: ${currentTab.maxAmount?.toFixed(2)} ${currentTab.type}`}
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
          {`${current === 'to' ? '구매 가능한 토큰 수량을 초과했습니다.' : '구매 가능 금액을 초과했습니다.'}`}
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
      }}
    >
      {balanceText}
      {maxText}
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
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: '#3679B5',
          width: '100%',
          marginTop: 14,
        }}
      />
      {guideText}
    </View>
  );
}

export default TxInputViewer;