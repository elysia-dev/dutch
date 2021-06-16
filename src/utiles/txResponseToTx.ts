import { BigNumber, utils } from 'ethers';
import { Transaction } from '../types/CryptoTxsResponse';
import Bignumberjs from 'bignumber.js';
import CryptoTransaction from '../types/CryptoTransaction';
import moment from 'moment';
import { TransactionResponse } from '@ethersproject/abstract-provider';

const txResponseToTx = (
  tx: Transaction,
  address: string,
): CryptoTransaction => {
  const value =
    tx.value !== '0'
      ? utils.formatEther(tx.value)
      : utils.formatEther(BigNumber.from(tx.gasUsed).mul(tx.gasPrice));

  return {
    type: tx.to.toUpperCase() === address.toUpperCase() ? 'in' : 'out',
    value: value.length > 12 ? new Bignumberjs(value).toFixed(2) : value,
    txHash: tx.hash,
    createdAt: moment.unix(parseInt(tx.timeStamp)).toString(),
  };
};

export default txResponseToTx;
