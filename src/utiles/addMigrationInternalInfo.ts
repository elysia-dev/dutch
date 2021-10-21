import moment from 'moment';
import CryptoType from '../enums/CryptoType';
import TransferType from '../enums/TransferType';
import { WaitingTransaction } from '../types/WaitingTransaction';

const addMigrationInternalInfo = (
  unstakingAmount?: string,
  rewardAmount?: string,
  cryptoType?: string,
  rewardCryptoType?: string,
): WaitingTransaction[] => {
  return [
    {
      transferType: TransferType.Unstaking,
      unit: cryptoType,
      date: moment().format('YYYY-MM-DD | HH:mm:ss'),
      amount: unstakingAmount,
    },
    {
      transferType: TransferType.StakingReward,
      unit: rewardCryptoType,
      date: moment().format('YYYY-MM-DD | HH:mm:ss'),
      amount: rewardAmount,
    },
  ];
};

export default addMigrationInternalInfo;
