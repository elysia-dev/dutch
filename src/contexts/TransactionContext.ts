import { TransactionResponse } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { createContext } from 'react';
import CryptoType from '../enums/CryptoType';
import StakingType from '../enums/StakingType';
import ToastStatus from '../enums/ToastStatus';
import TransferType from '../enums/TransferType';
import CryptoTransaction from '../types/CryptoTransaction';
import { WaitingTransaction } from '../types/WaitingTransaction';

export type TransactionType = {
  transactions: CryptoTransaction[];
  waitingTxs: WaitingTransaction[];
  isSuccessTx: boolean;
  counter: number;
  uuid: string;
};

export interface ITransactionContext extends TransactionType {
  setWaitingTx: (
    transferType: string,
    amount: string,
    resTx?: TransactionResponse | WaitingTransaction,
    cryptoType?: CryptoType | string,
    productUnit?: string,
    migrationInternalInfo?: WaitingTransaction[],
  ) => void;
  addPendingTx: (
    transferType: TransferType,
    amount: string,
    resTx?: TransactionResponse,
    cryptoType?: CryptoType,
    productUnit?: string,
    migrationInternalInfo?: WaitingTransaction[],
  ) => void;
  removeStorageTx: (txHash?: string) => void;
  findSucceedTx: (tx: WaitingTransaction) => Promise<WaitingTransaction[]>;
  verifyTx: (
    tx: WaitingTransaction,
    migrationInternalInfo?: WaitingTransaction[],
  ) => void;
  setUuid: (uuid: string) => void;
  setToastList: (type: string, status: ToastStatus) => void;
}

export const initialTransactions = {
  transactions: [],
  waitingTxs: [],
  isSuccessTx: false,
  counter: 0,
  uuid: '',
};

export const initialTransactionContext = {
  ...initialTransactions,
  setWaitingTx: () => {},
  addPendingTx: () => {},
  removeStorageTx: () => {},
  findSucceedTx: async () => {
    return [];
  },
  verifyTx: () => {},
  setUuid: () => {},
  setToastList: () => {},
};

const TransactionContext = createContext<ITransactionContext>(
  initialTransactionContext,
);

export default TransactionContext;
