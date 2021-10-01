import React, { useContext, useEffect, useState } from 'react';
import { TransactionResponse } from '@ethersproject/providers';
import { useNavigation } from '@react-navigation/native';
import { BigNumber, utils } from 'ethers';
import CryptoType from '../enums/CryptoType';
import TransferType from '../enums/TransferType';
import useTxHandler from './useTxHandler';
import PriceContext from '../contexts/PriceContext';
import WalletContext from '../contexts/WalletContext';
import NetworkType from '../enums/NetworkType';
import useErcContract from './useErcContract';
import useWaitTx from './useWaitTx';
import { WaitingTransaction } from '../types/WaitingTransaction';

export default function useTransferTx(cryptoType: CryptoType) {
  const { gasPrice, bscGasPrice } = useContext(PriceContext);
  const { wallet } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resTx, setResTx] = useState<TransactionResponse>();
  const { afterTxHashCreated, afterTxCreated, afterTxFailed } = useTxHandler();
  const navigation = useNavigation();
  const { elContract, elfiContract, daiContract } = useErcContract();
  const { waitingTxs, setWaitingTx, removeStorageTx } = useWaitTx(cryptoType);

  const setErcContract = (cryptoType: CryptoType) => {
    if (cryptoType === CryptoType.ELFI) {
      return elfiContract;
    } else if (cryptoType === CryptoType.DAI) {
      return daiContract;
    } else {
      return elContract;
    }
  };
  const notifyFail = () => {
    navigation.goBack();
    afterTxFailed('Transaction failed');
  };

  const getLastNonce = () => {
    let txs: WaitingTransaction[];
    if (cryptoType === CryptoType.BNB) {
      txs = waitingTxs.filter((tx) => {
        return tx.cryptoType === CryptoType.BNB;
      });
    } else {
      txs = waitingTxs.filter((tx) => {
        return tx.cryptoType !== CryptoType.BNB;
      });
    }
    return txs.length !== 0
      ? waitingTxs[waitingTxs.length - 1].nonce
      : undefined;
  };

  const transferCrypto = async (value: string, address?: string) => {
    try {
      let lastNonce: number | undefined;
      if (waitingTxs) {
        lastNonce = getLastNonce();
      }
      const res = await transfer(value, address, lastNonce);
      setResTx(res);
      setWaitingTx(TransferType.Send, value, res);
    } catch (error) {
      console.log(error);
      throw Error;
    }
  };

  const transfer = async (
    value: string,
    address?: string,
    lastNonce?: number,
  ) => {
    try {
      setIsLoading(true);
      if (
        [CryptoType.EL, CryptoType.ELFI, CryptoType.DAI].includes(cryptoType)
      ) {
        const ercContract = setErcContract(cryptoType);
        return await ercContract?.transfer(
          address || '',
          utils.parseEther(value || ''),
          {
            nonce: lastNonce ? lastNonce + 1 : undefined,
          },
        );
      } else {
        return await wallet?.getFirstSigner(cryptoType).sendTransaction({
          to: address,
          value: utils.parseEther(value || '').toHexString(),
          gasPrice:
            cryptoType === CryptoType.BNB
              ? BigNumber.from(bscGasPrice)
              : BigNumber.from(gasPrice),
          nonce: lastNonce ? lastNonce + 1 : undefined,
        });
      }
    } catch (e) {
      throw Error;
      // notifyFail();
    }
  };

  const waitTx = async () => {
    try {
      await resTx?.wait();
      removeStorageTx(resTx?.hash);
      afterTxCreated(resTx?.hash || '', NetworkType.ETH);
    } catch (error) {
      throw Error;
    }
  };

  const noticeTxStatus = () => {
    afterTxHashCreated(
      resTx?.from || '',
      resTx?.to || '',
      resTx?.hash || '',
      NetworkType.ETH,
    );
  };

  useEffect(() => {
    if (resTx) {
      navigation.goBack();
      noticeTxStatus();
      waitTx();
    }
  }, [resTx]);

  return { isLoading, transferCrypto };
}
