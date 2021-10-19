import React from 'react';
import { Text, View } from 'react-native';
import AppColors from '../../../enums/AppColors';
import AppFonts from '../../../enums/AppFonts';
import TransferType from '../../../enums/TransferType';
import { P2Text, P3Text } from '../../../shared/components/Texts';
import { WaitingTransaction } from '../../../types/WaitingTransaction';

interface WaitngTransactionItem {
  waitingTransaction: WaitingTransaction;
}

const WaitingTxListItem: React.FC<WaitngTransactionItem> = ({
  waitingTransaction,
}) => {
  const { transferType, date, amount, unit } = waitingTransaction;
  return (
    <>
      {waitingTransaction.migrationInfo &&
        waitingTransaction.migrationInfo.map((tx, idx) => {
          return <WaitingTxListItem key={idx} waitingTransaction={tx} />;
        })}
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: AppColors.GREY,
          borderBottomWidth: 1,
          paddingBottom: 25,
          marginBottom: 27,
          paddingHorizontal: 9,
          alignItems: 'center',
        }}>
        <View>
          <P3Text
            label={transferType}
            style={{
              fontFamily: AppFonts.Medium,
              color: AppColors.BLACK,
            }}
          />
          <P3Text
            label={date}
            style={{
              fontSize: 11,
              fontFamily: AppFonts.Medium,
              color: AppColors.BLACK2,
            }}
          />
        </View>
        <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
          <P2Text
            label={amount!}
            style={{
              fontFamily: AppFonts.Medium,
              color: AppColors.BLACK,
            }}
          />
          <P2Text
            label={unit!}
            style={{
              fontFamily: AppFonts.Medium,
              color: AppColors.TEXT_GREY2,
            }}
          />
        </View>
      </View>
    </>
  );
};

export default WaitingTxListItem;
