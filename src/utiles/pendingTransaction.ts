import React, { useContext } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import TxStatus from '../enums/TxStatus';
import Asset from '../types/Asset';
import AssetDetail from '../types/AssetDetail';
import CryptoTransaction from '../types/CryptoTransaction';

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
  const pendingTxs = transactions.filter((tx) => {
    const isPending = tx.status === TxStatus.Pending;
    if (tx.cryptoType === CryptoType.ELA) {
      return isPending && tx.cryptoType === CryptoType.ELA;
    }
    return isPending && tx.cryptoType === asset.type;
  });
  const notPendingTxs = state.transactions.filter(
    (tx) => tx.status !== TxStatus.Pending,
  );
  if (pendingTxs.length > 0) {
    return pendingTxs.concat(notPendingTxs);
  }
  const successTx = transactions.filter((tx) => tx.status === TxStatus.Success);
  let resentTx = state.transactions.findIndex(
    (tx) => tx.txHash === successTx[0]?.txHash,
  );
  state.transactions[resentTx] = successTx[0];
  return [...state.transactions];
};

export const getPendingTx = (
  transactions: CryptoTransaction[],
  resTx: CryptoTransaction[],
  resProductId: number | '',
  assetType?: CryptoType,
) => {
  const pendingTxs: CryptoTransaction[] = transactions.filter((tx) => {
    if (resProductId) {
      return tx.status === TxStatus.Pending && tx.productId === resProductId;
    }
    return tx.cryptoType === assetType && tx.status === TxStatus.Pending;
  });
  let isCurrentPendingTx = true;
  if (pendingTxs.length > 0) {
    isCurrentPendingTx =
      resTx.findIndex((tx) => pendingTxs[0].txHash === tx.txHash) !== -1;
  }
  return { isCurrentPendingTx, pendingTxs };
};
