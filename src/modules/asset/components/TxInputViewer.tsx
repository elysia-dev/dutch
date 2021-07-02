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
}) => {
  let valueText;
  let guideText;

  if (value) {
    valueText = (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <Text
          style={{
            fontSize: 30,
            color: '#1C1C1C',
            fontWeight: 'bold',
            }}
          >
            {value}
          </Text>
        <Text
          style={{
            fontSize: 25,
            color: '#666666',
            fontWeight: 'bold',
          }}
        >
          {' ' + type}
        </Text>
      </View>
    );
  } else {
    valueText = (
      <Text
        style={{
          fontSize: 30,
          textAlign: 'center',
          color: value ? '#1C1C1C' : '#CCCCCC',
        }}
      >
        {current === 'to' ? '몇 개를 구매할까요?' : '얼마를 구매할까요?'}
      </Text>
    );
  }

  guideText = (
    <View
      style={{
        marginTop: 10,
        marginRight: 10,
        width: '100%',
      }}
    >
      <Text
        style={{
          textAlign: 'right',
          color: '#BABABA',
          fontSize: 12,
        }}
      >
        {`${current === 'to' ? '투자 가능 토큰 수량' : '투자 가능 금액'}: ${maxAmount} ${type}`}
      </Text>
      <Text
        style={{
          textAlign: 'right',
          color: '#BABABA',
          fontSize: 12,
        }}
      >
        {`지갑 잔액: ${balance.toFixed(2)} ${type}`}
      </Text>
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
          borderColor: '#F1F1F1',
          width: '100%',
          marginTop: 14,
        }}
      />
      {guideText}
    </View>
  );
}

export default TxInputViewer;