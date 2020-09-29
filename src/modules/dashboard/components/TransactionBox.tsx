import React, { FunctionComponent, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import * as Linking from 'expo-linking';
import i18n from '../../../i18n/i18n';
import { Transaction } from '../../../types/Transaction';

interface Props {
  transaction: Transaction;
}

const GText = styled.Text`
  color: #626368;
  font-size: 15px;
  text-align: left;
  font-weight: 300;
  margin-bottom: 8px;
`;
export const TransactionBox: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    show: false,
  });
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 15,
        paddingBottom: 15,
      }}>
      <View style={{ flexDirection: 'column' }}>
        <Text
          style={{
            color: '#1C1C1C',
            fontSize: 15,
            textAlign: 'left',
            marginBottom: 5,
          }}>
          {i18n.t(`dashboard_label.${props.transaction.transactionType}`)}
        </Text>
        <Text
          style={{
            color: '#A7A7A7',
            fontSize: 12,
            textAlign: 'left',
            marginBottom: 5,
          }}>
          {i18n.strftime(new Date(props.transaction.createdAt), '%m.%d')}
        </Text>
        {state.show && (
          <GText
            onPress={() => {
              Linking.openURL(
                `https://etherscan.io/token/${props.transaction.address}`,
              );
            }}
            style={{ fontSize: 12, textDecorationLine: 'underline' }}>
            {props.transaction.address}
          </GText>
        )}
        <TouchableOpacity
          onPress={() => setState({ ...state, show: !state.show })}
          style={{
            backgroundColor: '#A7A7A7',
            borderRadius: 2,
            width: 60,
            height: 20,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, color: '#fff', textAlign: 'center' }}>
              {state.show
                ? i18n.t('dashboard_label.fold')
                : i18n.t('dashboard_label.transaction')}
            </Text>
            <Image
              style={{
                width: 5,
                height: 3,
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: 3,
              }}
              source={
                state.show
                  ? require('../images/whiteupbutton.png')
                  : require('../images/whitedownbutton.png')
              }></Image>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            textAlign: 'right',
            color:
              props.transaction.transactionType === 'refund' ||
              props.transaction.transactionType === 'close'
                ? '#1C1C1C'
                : '#3679B5',
          }}>
          {props.transaction.transactionType === 'refund' ||
          props.transaction.transactionType === 'close'
            ? `- $${parseFloat(props.transaction.value).toFixed(2)}`
            : `$${parseFloat(props.transaction.value).toFixed(2)}`}
        </Text>
      </View>
    </View>
  );
};
