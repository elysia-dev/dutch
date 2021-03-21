import React from 'react';
import { View, Image } from 'react-native';
import AppColors from '../../../enums/AppColors';
import moment from 'moment';
import { P1Text, P3Text } from '../../../shared/components/Texts';
import CryptoTransaction from '../../../types/CryptoTransaction';

interface ITransactionItem {
  transaction: CryptoTransaction,
  unit: string,
}

const TransactionItem: React.FC<ITransactionItem> = ({
  transaction,
  unit
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: AppColors.GREY,
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
      }}
    >
      <Image
        style={{
          marginLeft: 10,
          width: 20,
          height: 20,
          transform: transaction.type === 'in' ? [{ rotate: '180deg' }] : []
        }}
        source={require('../images/blackCircleArrow.png')}
      />
      <View style={{ marginLeft: 10 }}>
        <P3Text
          label={`${transaction.txHash.slice(0, 6)}...${transaction.txHash.slice(-6)}`}
          style={{ color: AppColors.BLACK }}
        />
        <P3Text
          label={moment(transaction.createdAt).format('YYYY-MM-DD | HH:MM:SS')}
        />
      </View>
      <View style={{ marginLeft: 'auto' }}>
        <P1Text label={`${transaction.type === 'in' ? '+' : '-'} ${transaction.value} ${unit}`} />
      </View>
    </View>
  );
};

export default TransactionItem
