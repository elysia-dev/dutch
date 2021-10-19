import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import { useTranslation } from 'react-i18next';
import {
  EXTERNAL_WALLET_UUID,
  PENDING_TRANSACTIONS,
} from '../constants/storage';
import TransactionContext, {
  TransactionType,
  initialTransactions,
} from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import { bscProvider, provider } from '../utiles/getContract';
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
  const [successedHash, setSuccessedHash] = useState<string>('');
  const { t } = useTranslation();

  const setIsSuccessTx = useCallback(
    (isSuccess: boolean) => {
      setState({
        ...state,
        isSuccessTx: isSuccess,
      });
    },
    [state, state.waitingTxs],
  );

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
    transferType: TransferType | StakingType | string,
    cryptoType?: CryptoType | string,
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
    transferType: string,
    amount: string[],
    resTx?: TransactionResponse | WaitingTransaction,
    cryptoType?: CryptoType | string,
    productUnit?: string,
    // txhash?: string,
    // migration?: WaitingTransaction[],
  ) => {
    setStorageTx({
      transferType: t(transferType),
      unit:
        cryptoType === CryptoType.ELFI
          ? CryptoType.ELFI
          : setUnit(transferType, cryptoType, productUnit),
      date: moment().format('YYYY-MM-DD | HH:mm:ss'),
      nonce: resTx?.nonce,
      hash: resTx?.hash,
      amount: amount[0],
      cryptoType,
      migrationInfo:
        transferType === TransferType.Migration
          ? unstakingAndReward(amount, cryptoType, resTx)
          : undefined,
    });
  };

  const setStorageTx = useCallback(
    async (waitingTx: WaitingTransaction) => {
      try {
        await AsyncStorage.setItem(
          PENDING_TRANSACTIONS,
          JSON.stringify([...state.waitingTxs, waitingTx]),
        );
        setState({
          ...state,
          waitingTxs: [...state.waitingTxs, waitingTx],
        });
      } catch (error) {
        console.log(error);
      }
    },
    [state.waitingTxs],
  );

  const removeStorageTx = useCallback(
    async (txHash?: string) => {
      try {
        const txs = state.waitingTxs.filter((tx) => {
          return tx.hash !== txHash;
        });
        setSuccessedHash('');
        setState({
          ...state,
          waitingTxs: txs,
          isSuccessTx: true,
        });
        await AsyncStorage.setItem(PENDING_TRANSACTIONS, JSON.stringify(txs));
      } catch (error) {
        console.log(error);
      }
    },
    [state.waitingTxs],
  );

  const findSucceedTx = async (tx: WaitingTransaction) => {
    let res: TransactionReceipt;
    if (tx.cryptoType === CryptoType.BNB) {
      res = await bscProvider.getTransactionReceipt(tx.hash!);
    } else {
      res = await provider.getTransactionReceipt(tx.hash!);
    }
    const waitTx = state.waitingTxs?.filter((value) => {
      value.hash !== res.transactionHash;
    });
    if (waitTx) {
      setToastList(tx.transferType, ToastStatus.Success);
      await AsyncStorage.setItem(PENDING_TRANSACTIONS, JSON.stringify(waitTx));
      setState({
        ...state,
        waitingTxs: waitTx,
      });
    }
    return waitTx;
  };

  useEffect(() => {
    (async () => {
      let transactions: WaitingTransaction[] = [];
      await AsyncStorage.removeItem(PENDING_TRANSACTIONS);
      try {
        transactions = JSON.parse(
          (await AsyncStorage.getItem(PENDING_TRANSACTIONS)) || '[]',
        );
        transactions.forEach(async (tx) => {
          await verifyTx(tx);
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

  const addPendingTx = (
    transferType: TransferType,
    txAmounts: string,
    resTx?: TransactionResponse,
    cryptoType?: CryptoType,
    productUnit?: string,
  ) => {
    const amount = txAmounts.split(',');
    setIsSuccessTx(false);
    setToastList(transferType, ToastStatus.Waiting);
    setWaitingTx(transferType, amount, resTx, cryptoType, productUnit);
    resTx
      ?.wait()
      .then((tx) => {
        setSuccessedHash(tx.transactionHash);
        setToastList(transferType, ToastStatus.Success);
      })
      .catch(() => {
        setToastList(transferType, ToastStatus.Fail);
      });
  };

  const unstakingAndReward = (
    amount: string[],
    cryptoType?: CryptoType | string,
    resTx?: TransactionResponse | WaitingTransaction,
  ) => {
    return [
      {
        transferType: t(TransferType.Unstaking),
        unit: setUnit(TransferType.Unstaking, cryptoType),
        date: moment().format('YYYY-MM-DD | HH:mm:ss'),
        nonce: resTx?.nonce,
        hash: resTx?.hash,
        amount: amount[1],
        cryptoType,
      },
      {
        transferType: t(TransferType.StakingReward),
        unit: setUnit(TransferType.StakingReward, cryptoType),
        date: moment().format('YYYY-MM-DD | HH:mm:ss'),
        nonce: resTx?.nonce,
        hash: resTx?.hash,
        amount: amount[2],
        cryptoType,
      },
    ];
  };

  const setUuid = async (uuid: string) => {
    await AsyncStorage.setItem(EXTERNAL_WALLET_UUID, uuid);
    setState({
      ...state,
      uuid,
    });
  };

  const verifyTx = async (tx: WaitingTransaction) => {
    try {
      let res: TransactionReceipt;
      setIsSuccessTx(false);
      const amount = tx.amount?.split(',');
      setWaitingTx(tx.transferType, amount!, tx, tx.cryptoType, tx.unit);
      if (tx.cryptoType === CryptoType.BNB) {
        res = await bscProvider.waitForTransaction(tx.hash!);
      } else {
        res = await provider.waitForTransaction(tx.hash!);
      }
      if (res) {
        setSuccessedHash(res.transactionHash);
        setToastList(tx.transferType, ToastStatus.Success);
      }
      console.log(tx);
    } catch (error) {
      console.log(error);
    } finally {
      await AsyncStorage.removeItem(EXTERNAL_WALLET_UUID);
    }
  };

  useEffect(() => {
    if (state.waitingTxs.length && successedHash) {
      removeStorageTx(successedHash);
    }
  }, [state.waitingTxs, successedHash]);

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        setWaitingTx,
        addPendingTx,
        removeStorageTx,
        findSucceedTx,
        verifyTx,
        setUuid,
        setIsSuccessTx,
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
