import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react';
import { useState } from "react";
import { PENDING_TRANSACTIONS } from '../constants/storage';
import TransactionContext, { TransactionType, initialTransactions } from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import TxStatus from '../enums/TxStatus';
import CryptoTransaction from '../types/CryptoTransaction';
import { bscProvider, provider } from '../utiles/getContract';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import getTxScanLink from '../utiles/getTxScanLink';
import NetworkType from '../enums/NetworkType';

const TransactionProvider: React.FC = (props) => {
  const [state, setState] = useState<TransactionType>(initialTransactions)
  const { t } = useTranslation()

  const addPendingTransaction = async (pendingTx: CryptoTransaction) => {
    await AsyncStorage.setItem(
      PENDING_TRANSACTIONS,
      JSON.stringify([{ ...pendingTx, status: TxStatus.Pending }, ...state.transactions.filter((tx) => tx.status === TxStatus.Pending)])
    )

    setState({
      ...state,
      transactions: [{ ...pendingTx, status: TxStatus.Pending }, ...state.transactions],
      counter: state.counter + 1,
    })
  }

  useEffect(() => {
    (async () => {
      let transactions = [];

      try {
        transactions = JSON.parse(await AsyncStorage.getItem(PENDING_TRANSACTIONS) || '[]')
      } finally {
        setState({
          ...state,
          transactions,
        })
      }
    })
  }, [])

  useEffect(() => {
    if (state.transactions.filter((tx) => tx.status === TxStatus.Pending).length === 0) return;

    let timer = setTimeout(async () => {
      const txResponses = await Promise.all(state.transactions.filter((tx) => tx.status === TxStatus.Pending).map(async (tx) => {
        const usedProvider = tx.cryptoType === CryptoType.BNB ? bscProvider : provider
        return await usedProvider.getTransactionReceipt(tx.txHash || '')
      }))

      const transactions = state.transactions.map((tx) => {
        const txRes = txResponses.find((res) => res && res.transactionHash === tx.txHash);

        if (txRes) {
          if (txRes.status === 1) {
            showMessage({
              message: t('transaction.created'),
              description: tx.txHash,
              type: 'info',
              onPress: () => {
                Linking.openURL(
                  getTxScanLink(tx.txHash, tx.cryptoType === CryptoType.BNB ? NetworkType.BSC : NetworkType.ETH)
                )
              },
              duration: 3000
            });
          }
          return {
            ...tx,
            status: txRes.status === 1 ? TxStatus.Success : TxStatus.Fail
          }
        } else {
          return tx
        }
      })

      await AsyncStorage.setItem(PENDING_TRANSACTIONS, JSON.stringify(transactions.filter((tx) => { tx.status === TxStatus.Pending })))

      setState({
        ...state,
        transactions,
        counter: state.counter + 1,
      })
    }, 5000)

    return () => {
      clearTimeout(timer);
    }
  }, [state.counter])

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        addPendingTransaction,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
}

export default TransactionProvider;