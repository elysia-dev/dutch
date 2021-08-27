import { ethers } from 'ethers';
import { createContext } from 'react';
import CryptoTransaction from '../types/CryptoTransaction';

export type TransactionType = {
  transactions: CryptoTransaction[];
  counter: number;
  isSuccessTx: boolean;
};

export interface ITransactionContext extends TransactionType {
  addPendingTransaction: (
    txRes: ethers.providers.TransactionResponse | undefined,
    tx: CryptoTransaction,
  ) => void;
  setIsSuccessTx: (isSuccessTx: boolean) => void;
}

export const initialTransactions = {
  transactions: [],

  counter: 0,
  isSuccessTx: false,
};

export const initialTransactionContext = {
  ...initialTransactions,
  addPendingTransaction: () => {},
  setIsSuccessTx: () => {},
};

const TransactionContext = createContext<ITransactionContext>(
  initialTransactionContext,
);

export default TransactionContext;
