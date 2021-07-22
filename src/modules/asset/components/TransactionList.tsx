import React from 'react';
import {
  View,
  VirtualizedList,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { P2Text } from '../../../shared/components/Texts';
import CryptoTransaction from '../../../types/CryptoTransaction';
import TransactionItem from './TransactionItem';
import NetworkType from '../../../enums/NetworkType';
import { Item } from '../../products/components/Item';

interface ITransactionList {
  data: CryptoTransaction[];
  unit: string;
  networkType: NetworkType;
  loading?: boolean;
}

const TransactionList: React.FC<ITransactionList> = ({
  data,
  unit,
  networkType,
  loading,
}) => {
  const { t } = useTranslation();
  const crypto: CryptoTransaction[] = [];

  return (
    <SafeAreaView
      style={{
        minHeight: 200,
      }}>
      {data.length === 0 && (
        <View
          style={{
            flexDirection: 'row',
            height: 200,
            alignItems: 'center',
          }}>
          {!loading && (
            <P2Text
              label={t('assets.null_transaction')}
              style={{ textAlign: 'center', width: '100%' }}
            />
          )}
        </View>
      )}

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <TransactionItem
              transaction={item}
              unit={unit}
              networkType={networkType}
            />
          );
        }}
        horizontal={false}
        keyExtractor={(item, index) => String(index)}
        nestedScrollEnabled={false}
      />
    </SafeAreaView>
  );
};

export default TransactionList;
