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
  counter: number;
};

export interface ITransactionContext extends TransactionType {
  setWaitingTx: (
    transferType: TransferType | StakingType,
    amount: string,
    resTx?: TransactionResponse,
    cryptoType?: CryptoType,
    productUnit?: string,
    isSuccess?: boolean,
  ) => void;
  removeStorageTx: (txHash?: string) => void;
  removeStorageTxByAppState: () => void;
  setToastList: (type: string, status: ToastStatus) => void;
}

export const initialTransactions = {
  transactions: [],
  waitingTxs: [],
  counter: 0,
};

export const initialTransactionContext = {
  ...initialTransactions,
  setWaitingTx: () => {},
  removeStorageTx: () => {},
  removeStorageTxByAppState: () => {},
  setToastList: () => {},
};

const TransactionContext = createContext<ITransactionContext>(
  initialTransactionContext,
);

export default TransactionContext;
