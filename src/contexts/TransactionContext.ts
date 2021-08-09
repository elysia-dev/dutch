import { ethers } from 'ethers';
import { createContext } from 'react';
import CryptoTransaction from '../types/CryptoTransaction';

export type TransactionType = {
  transactions: CryptoTransaction[];
  counter: number;
};

export interface ITransactionContext extends TransactionType {
  addPendingTransaction: (
    txRes: ethers.providers.TransactionResponse | undefined,
    tx: CryptoTransaction,
  ) => void;
}

export const initialTransactions = {
  transactions: [],
  counter: 0,
};

export const initialTransactionContext = {
  ...initialTransactions,
  addPendingTransaction: () => {},
};

const TransactionContext = createContext<ITransactionContext>(
  initialTransactionContext,
);

export default TransactionContext;
