import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { Linking, View } from 'react-native';
import moment from 'moment';
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import { useTranslation } from 'react-i18next';
import { PENDING_TRANSACTIONS } from '../constants/storage';
import TransactionContext, {
  TransactionType,
  initialTransactions,
} from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import TxStatus from '../enums/TxStatus';
import { bscProvider, provider } from '../utiles/getContract';
import getTxScanLink from '../utiles/getTxScanLink';
import NetworkType from '../enums/NetworkType';
import AssetContext from '../contexts/AssetContext';
import {
  ToastTransaction,
  WaitingTransaction,
} from '../types/WaitingTransaction';
import TransferType from '../enums/TransferType';
import StakingType from '../enums/StakingType';
import ToastMessage from '../shared/components/ToastMessage';
import ToastStatus from '../enums/ToastStatus';

const TransactionProvider: React.FC = (props) => {
  const { refreshBalance } = useContext(AssetContext);
  const [state, setState] = useState<TransactionType>(initialTransactions);
  const [toasts, setToasts] = useState<ToastTransaction[]>([]);
  const { t } = useTranslation();

  const setToastList = (type: string, status: ToastStatus) => {
    setToasts((prev: ToastTransaction[]) => {
      return [
        ...prev,
        {
          id: toasts[toasts.length - 1] ? toasts[toasts.length - 1].id + 1 : 1,
          transferType: type,
          isWaitingTx: status === ToastStatus.Waiting,
          isFailTx: status === ToastStatus.Fail,
          isSuccessTx: status === ToastStatus.Success,
        },
      ];
    });
  };

  const setUnit = (
    transferType: TransferType | StakingType,
    cryptoType?: CryptoType,
    productUnit?: string,
  ) => {
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
    cryptoType?: CryptoType,
    productUnit?: string,
  ) => {
    setStorageTx({
      transferType: t(transferType),
      unit: setUnit(transferType, cryptoType, productUnit),
      date: moment().format('YYYY-MM-DD | HH:mm:ss'),
      nonce: resTx?.nonce,
      txHash: resTx?.hash,
      amount,
      cryptoType,
    });
  };

  const setStorageTx = async (waitingTransaction: WaitingTransaction) => {
    try {
      if (waitingTransaction.transferType === TransferType.Migration) {
        const txs = JSON.parse(
          (await AsyncStorage.getItem(PENDING_TRANSACTIONS)) || '[]',
        );
        setState({
          ...state,
          waitingTxs: [...JSON.parse(txs), waitingTransaction],
        });
        return;
      }
      await AsyncStorage.setItem(
        PENDING_TRANSACTIONS,
        JSON.stringify([...state.waitingTxs, waitingTransaction]),
      );
      setState({
        ...state,
        waitingTxs: [...state.waitingTxs, waitingTransaction],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeStorageTx = async (txHash?: string) => {
    try {
      const txs = state.waitingTxs.filter((tx) => {
        return tx.txHash !== txHash;
      });
      setState({
        ...state,
        waitingTxs: txs,
      });
      await AsyncStorage.setItem(PENDING_TRANSACTIONS, JSON.stringify(txs));
    } catch (error) {
      console.log(error);
    }
  };

  const succeedTx = async (tx: WaitingTransaction) => {
    let res: TransactionReceipt;
    if (tx.cryptoType === CryptoType.BNB) {
      res = await bscProvider.getTransactionReceipt(tx.txHash!);
    } else {
      res = await provider.getTransactionReceipt(tx.txHash!);
    }
    const waitTx = state.waitingTxs?.filter((value) => {
      value.txHash !== res.transactionHash;
    });
    if (waitTx) {
      await AsyncStorage.setItem(PENDING_TRANSACTIONS, JSON.stringify(waitTx));
      setState({
        ...state,
        waitingTxs: waitTx,
      });
    }
  };

  const removeStorageTxByAppState = async () => {
    try {
      if (state.waitingTxs.length === 0) return;
      state.waitingTxs.forEach(async (tx) => {
        await succeedTx(tx);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      let transactions: WaitingTransaction[] = [];
      try {
        transactions = JSON.parse(
          (await AsyncStorage.getItem(PENDING_TRANSACTIONS)) || '[]',
        );
        transactions.forEach(async (tx) => {
          await succeedTx(tx);
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const toastHide = (id: number) => {
    setToasts(
      toasts.filter((tx) => {
        return tx.id !== id;
      }),
    );
  };

  useEffect(() => {
    if (
      state.transactions.filter((tx) => tx.status === TxStatus.Pending)
        .length === 0
    )
      return;

    let timer = setTimeout(async () => {
      const txResponses = await Promise.all(
        state.transactions
          .filter((tx) => tx.status === TxStatus.Pending)
          .map(async (tx) => {
            const usedProvider =
              tx.cryptoType === CryptoType.BNB ? bscProvider : provider;
            return await usedProvider.getTransactionReceipt(tx.txHash || '');
          }),
      );

      const transactions = state.transactions.map((tx) => {
        const txRes = txResponses.find(
          (res) => res && res.transactionHash === tx.txHash,
        );

        if (txRes) {
          if (txRes.status === 1) {
            // timeout이 필요한 이유? : 트랜잭션 요청후, 바로 요청할 경우 balance가 아직 이전 값으로 조회되는 문제가 있음
            // 경우따라 timeout을 더 늘려야할 수도 있음!
            setTimeout(() => {
              tx.cryptoType && refreshBalance(tx.cryptoType);
            }, 500);

            showMessage({
              message: t('transaction.created'),
              description: tx.txHash,
              type: 'info',
              onPress: () => {
                Linking.openURL(
                  getTxScanLink(
                    tx.txHash,
                    tx.cryptoType === CryptoType.BNB
                      ? NetworkType.BSC
                      : NetworkType.ETH,
                  ),
                );
              },
              duration: 3000,
            });
            return {
              ...tx,
              status: TxStatus.Success,
            };
          } else {
            showMessage({
              message: t('transaction.fail'),
              description: tx.txHash,
              type: 'danger',
              onPress: () => {
                Linking.openURL(
                  getTxScanLink(
                    tx.txHash,
                    tx.cryptoType === CryptoType.BNB
                      ? NetworkType.BSC
                      : NetworkType.ETH,
                  ),
                );
              },
              duration: 3000,
            });

            return {
              ...tx,
              status: TxStatus.Fail,
            };
          }
        } else {
          return tx;
        }
      });

      await AsyncStorage.setItem(
        PENDING_TRANSACTIONS,
        JSON.stringify(
          transactions.filter((tx) => tx.status === TxStatus.Pending),
        ),
      );

      setState({
        ...state,
        transactions,
        counter: state.counter + 1,
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [state.counter]);

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        setWaitingTx,
        removeStorageTx,
        removeStorageTxByAppState,
        setToastList,
      }}>
      {props.children}
      <View
        style={{
          position: 'absolute',
          bottom: 100,
          width: '100%',
          alignItems: 'center',
        }}>
        {toasts.map((tx, idx) => {
          return (
            <ToastMessage
              waitingTx={tx}
              key={idx}
              toastHide={(id) => toastHide(id)}
            />
          );
        })}
      </View>
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
