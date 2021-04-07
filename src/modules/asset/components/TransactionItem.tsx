import React, { useContext } from 'react';
import { View, Image, Linking, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppColors from '../../../enums/AppColors';
import moment from 'moment';
import { P1Text, P3Text } from '../../../shared/components/Texts';
import CryptoTransaction from '../../../types/CryptoTransaction';
import PreferenceContext from '../../../contexts/PreferenceContext';
import { useTranslation } from 'react-i18next';
import NetworkType from '../../../enums/NetworkType';
import getTxScanLink from '../../../utiles/getTxScanLink';
import TxStatus from '../../../enums/TxStatus';

interface ITransactionItem {
  transaction: CryptoTransaction,
  unit: string,
  networkType: NetworkType,
}

const TransactionItem: React.FC<ITransactionItem> = ({
  transaction,
  unit,
  networkType
}) => {
  const { currencyFormatter } = useContext(PreferenceContext);
  const { t } = useTranslation();

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
      {
        transaction.status === TxStatus.Pending ? <ActivityIndicator size="small" color="#1c1c1c" style={{ marginLeft: 10 }} /> :
          <Image
            style={{
              marginLeft: 10,
              width: 20,
              height: 20,
              transform: transaction.type === 'out' ? [] : [{ rotate: '180deg' }]
            }}
            source={require('../images/blackCircleArrow.png')}
          />
      }
      <View style={{ marginLeft: 10 }}>
        {
          transaction.legacyType && <P1Text
            label={t(
              `dashboard_label.${transaction.legacyType}`,
            )}
          />
        }
        {
          transaction.txHash && <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                getTxScanLink(transaction.txHash, networkType)
              );
            }}
          >
            <P3Text
              label={`${transaction.txHash.slice(0, 6)}...${transaction.txHash.slice(-6)}`}
              style={{ color: AppColors.BLACK }}
            />
          </TouchableOpacity>
        }
        <P3Text
          label={moment(transaction.createdAt).format('YYYY-MM-DD | HH:MM:SS')}
        />
      </View>
      <View style={{ marginLeft: 'auto' }}>
        <P1Text
          label={
            ['profit', 'expectedProfit'].includes(transaction.legacyType || '') ?
              currencyFormatter(parseFloat(transaction.value)) :
              `${transaction.type === 'out' ? '-' : '+'} ${parseFloat(transaction.value).toFixed(2)} ${unit}`
          }
        />
      </View>
    </View>
  );
};

export default TransactionItem
