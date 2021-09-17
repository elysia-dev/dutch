import { BigNumber, utils } from 'ethers';
import Bignumberjs from 'bignumber.js';
import moment from 'moment';
import { Transaction } from '../types/CryptoTxsResponse';
import CryptoTransaction from '../types/CryptoTransaction';

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
    value: value.length > 12 ? new Bignumberjs(value).toString() : value,
    txHash: tx.hash,
    createdAt: moment.unix(parseInt(tx.timeStamp)).toString(),
    blockNumber: Number(tx.blockNumber) - 1,
  };
};

export default txResponseToTx;
