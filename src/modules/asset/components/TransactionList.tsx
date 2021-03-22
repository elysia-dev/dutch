import React from 'react';
import { View } from 'react-native';
import { P2Text } from '../../../shared/components/Texts';
import CryptoTransaction from '../../../types/CryptoTransaction';
import TransactionItem from './TransactionItem';
import { useTranslation } from 'react-i18next';

interface ITransactionList {
  data: CryptoTransaction[],
  unit: string,
}

const TransactionList: React.FC<ITransactionList> = ({
  data,
  unit
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        minHeight: 200,
      }}
    >
      {
        data.length === 0 && <View
          style={{
            flexDirection: 'row',
            height: 200,
            alignItems: 'center'
          }}
        >
          <P2Text label={t('assets.null_transaction')} style={{ textAlign: 'center', width: '100%' }} />
        </View>
      }
      { data.map((tx, index) => {
        return <TransactionItem
          key={index}
          transaction={tx}
          unit={unit}
        />
      })}
    </View >
  );
};

export default TransactionList
