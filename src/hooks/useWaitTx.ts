import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BigNumber, utils } from 'ethers';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PENDING_TRANSACTIONS } from '../constants/storage';
import CryptoType from '../enums/CryptoType';
import StakingType from '../enums/StakingType';
import TransferType from '../enums/TransferType';
import { WaitingTransaction } from '../types/WaitingTransaction';
import { bscProvider, provider } from '../utiles/getContract';
import getTransferType from '../utiles/getTransferType';

const useWaitTx = (cryptoType?: CryptoType, productUnit?: string) => {
  const [waitingTxs, setWaitingTxs] = useState<WaitingTransaction[]>([]);
  const { t } = useTranslation();

  const setUnit = (transferType: TransferType | StakingType) => {
    return transferType === TransferType.StakingReward
      ? cryptoType === CryptoType.EL
        ? CryptoType.ELFI
        : CryptoType.DAI
      : productUnit
      ? productUnit
      : cryptoType;
  };

  const setWaitingTx = (
    transferType: TransferType | StakingType,
    amount: string,
    resTx?: TransactionResponse,
  ) => {
    let type = '';
    type = getTransferType(transferType, t);
    setStorageTx({
      transferType: type,
      unit: setUnit(transferType),
      date: moment().format('YYYY-MM-DD | HH:mm:ss'),
      nonce: resTx?.nonce,
      txHash: resTx?.hash,
      amount,
      cryptoType,
    });
  };

  const setStorageTx = async (waitingTransaction: WaitingTransaction) => {
    try {
      if (waitingTxs) {
        await AsyncStorage.setItem(
          PENDING_TRANSACTIONS,
          JSON.stringify([...waitingTxs, waitingTransaction]),
        );
      } else {
        await AsyncStorage.setItem(
          PENDING_TRANSACTIONS,
          JSON.stringify([waitingTransaction]),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStorageTx = async () => {
    try {
      const items = await AsyncStorage.getItem(PENDING_TRANSACTIONS);
      if (!items) return [];
      const parsedItems: WaitingTransaction[] = JSON.parse(items);
      setWaitingTxs(parsedItems);
      return parsedItems;
    } catch (error) {
      console.log(error);
    }
  };

  const succeedTx = async (
    tx: WaitingTransaction,
    txs: WaitingTransaction[],
  ) => {
    let res: TransactionReceipt;
    if (tx.cryptoType === CryptoType.BNB) {
      res = await bscProvider.getTransactionReceipt(tx.txHash || '');
    } else {
      res = await provider.getTransactionReceipt(tx.txHash || '');
    }
    const waitTx = txs?.filter((i) => {
      i.txHash !== res.transactionHash;
    });
    if (waitTx) {
      await AsyncStorage.setItem(PENDING_TRANSACTIONS, JSON.stringify(waitTx));
    }
  };

  const removeStorageTxByAppState = async () => {
    try {
      const txs = await getStorageTx();
      if (!txs || txs?.length === 0) return;
      txs.forEach((tx) => {
        succeedTx(tx, txs);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeStorageTx = async (txHash?: string) => {
    try {
      const items = await getStorageTx();
      const txs = items?.filter((tx) => {
        return tx.txHash !== txHash;
      });
      await AsyncStorage.setItem(PENDING_TRANSACTIONS, JSON.stringify(txs));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStorageTx();
  }, []);

  return {
    waitingTxs,
    setWaitingTx,
    getStorageTx,
    removeStorageTx,
    removeStorageTxByAppState,
  };
};

export default useWaitTx;
