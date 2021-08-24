import React, { useContext } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import TxStatus from '../enums/TxStatus';
import Asset from '../types/Asset';
import AssetDetail from '../types/AssetDetail';
import CryptoTransaction from '../types/CryptoTransaction';
import { provider } from './getContract';

export const changeTxStatus = (
  asset: Asset,
  state:
    | {
        page: number;
        transactions: CryptoTransaction[];
        lastPage: boolean;
        loading: boolean;
      }
    | AssetDetail,
  transactions: CryptoTransaction[],
) => {
  const pendingTxs = transactions.filter(
    (tx) =>
      tx.status === TxStatus.Pending ||
      tx.cryptoType === CryptoType.ELA ||
      tx.cryptoType === asset.type,
  );
  const notPendingTxs = state.transactions.filter(
    (tx) => tx.status !== TxStatus.Pending,
  );
  if (pendingTxs.length > 0) {
    return pendingTxs.concat(notPendingTxs);
  }
  let resentTx;
  const successTx = transactions.filter((tx) => tx.status === TxStatus.Success);
  resentTx = state.transactions.findIndex(
    (tx) => tx.txHash === successTx[0]?.txHash,
  );
  state.transactions[resentTx] = successTx[0];
  return [...state.transactions];
};

export const getPendingTx = (
  transactions: CryptoTransaction[],
  resProductId: number | '',
  assetType?: CryptoType,
) => {
  const pendingTxs: CryptoTransaction[] = transactions.filter((tx) => {
    if (resProductId) {
      return tx.status === TxStatus.Pending && tx.productId === resProductId;
    }
    return tx.cryptoType === assetType && tx.status === TxStatus.Pending;
  });
  return pendingTxs;
};
