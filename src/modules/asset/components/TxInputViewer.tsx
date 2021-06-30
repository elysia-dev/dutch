import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  current: string
  value: string
  type: string
  maxAmount: number | undefined // 투자가능금액
  balance: number // 잔고
}

const TxInputViewer: React.FC<Props> = ({
  current,
  value,
  type,
  maxAmount,
  balance,
}) => { // 이름이 좋진 않다... 다른 걸로 바꾸기
  const isValueNotEmpty = value // && Number(value) !== 0 && value !== '0.';
  let valueText;
  let guideText;

  if (current === 'to') {
    if (isValueNotEmpty) {
      valueText = `${value} ${type}`;
    } else {
      valueText = '몇 개를 구매할까요?'; // 국제화 필요
    }
    if (maxAmount && maxAmount < balance) {
      guideText = `투자 가능 토큰 수량: ${maxAmount} ${type}`;
    } else {
      guideText = `지갑 잔액: ${balance.toFixed(2)} ${type}`; // 지갑잔액 말고 지갑잔액으로살수잇는부동산토큰수를표시해야함!!!!!!
    }
  } else {
    if (isValueNotEmpty) {
      valueText = `${value} ${type}`; // 달러를 보여줄지 EL을 보여줄지도 처리해야 함
    } else {
      valueText = '얼마를 구매할까요?';
    }
    if (maxAmount && maxAmount < balance) {
      guideText = `투자 가능 금액: ${maxAmount} ${type}`;
    } else {
      guideText = `지갑 잔액: ${balance.toFixed(2)} ${type}`;
    }
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
      <Text
        style={{
          fontSize: 30,
          textAlign: 'center',
          color: isValueNotEmpty ? '#1C1C1C' : '#CCCCCC',
        }}
      >
        {valueText}
      </Text>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: '#F1F1F1',
          width: '100%',
          marginTop: 14,
        }}
      />
      <Text
        style={{
          textAlign: 'right',
          color: '#BABABA',
          marginTop: 10,
          marginRight: 10,
          width: '100%',
        }}
      >
        {guideText}
      </Text>
    </View>
  );
}

export default TxInputViewer;