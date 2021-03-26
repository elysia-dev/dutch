import React, { FunctionComponent, useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next'
import * as Linking from 'expo-linking';
import moment from 'moment';
import { Transaction } from '../../../types/Transaction';
import {
  P1Text,
  P3Text,
  P4Text,
  H3Text,
} from '../../../shared/components/Texts';
import getEnvironment from '../../../utiles/getEnvironment';
import PreferenceContext from '../../../contexts/PreferenceContext';

interface Props {
  transaction: Transaction;
}

export const TransactionBox: FunctionComponent<Props> = (props: Props) => {
  const { currencyFormatter } = useContext(PreferenceContext)
  const { t } = useTranslation();

  const [state, setState] = useState({
    show: false,
  });
  return (
    <View style={{ flexDirection: 'column' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: 15,
          paddingBottom: 15,
        }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <P1Text
            style={{
              marginBottom: 5,
            }}
            label={t(
              `dashboard_label.${props.transaction.transactionType}`,
            )}
          />
          <P3Text
            style={{
              color: '#A7A7A7',
              fontSize: 12,
              textAlign: 'left',
              marginBottom: 5,
            }}
            label={moment(props.transaction.createdAt).format('MM.DD')}
          />
          {props.transaction.hash?.length > 0 && (
            <TouchableOpacity
              onPress={() => setState({ ...state, show: !state.show })}
              style={{
                backgroundColor: '#A7A7A7',
                borderRadius: 2,
                width: 75,
                height: 20,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <P4Text
                  style={{ color: '#fff', textAlign: 'center' }}
                  label={
                    state.show
                      ? t('dashboard_label.fold')
                      : t('dashboard_label.transaction')
                  }
                />
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
          )}
        </View>

        <View
          style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          <H3Text
            style={{
              fontSize: 17,
              textAlign: 'right',
              color:
                props.transaction.transactionType === 'refund' ||
                  props.transaction.transactionType === 'close' ||
                  props.transaction.transactionType === 'profit'
                  ? '#1C1C1C'
                  : '#3679B5',
            }}
            label={
              props.transaction.transactionType === 'refund' ||
                props.transaction.transactionType === 'close' ||
                props.transaction.transactionType === 'profit'
                ? `- ${currencyFormatter(
                  parseFloat(props.transaction.value),
                  2,
                )}`
                : currencyFormatter(
                  parseFloat(props.transaction.value),
                  2,
                )
            }
          />
        </View>
      </View>
      {state.show && (
        <Text
          allowFontScaling={false}
          onPress={() => {
            Linking.openURL(
              getEnvironment().envName === 'PRODUCTION'
                ? `https://etherscan.io/tx/${props.transaction.hash}`
                : `https://kovan.etherscan.io/tx/${props.transaction.hash}`,
            );
          }}
          style={{
            fontSize: 12,
            textDecorationLine: 'underline',
            color: '#626368',
            textAlign: 'left',
            marginBottom: 8,
          }}>
          {props.transaction.hash}
        </Text>
      )}
    </View>
  );
};
