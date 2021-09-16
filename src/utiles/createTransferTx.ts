import React, { useContext, useEffect, useState } from 'react';
import { TransactionResponse } from '@ethersproject/providers';
import { useNavigation } from '@react-navigation/native';
import { Contract } from '@ethersproject/contracts';
import CryptoType from '../enums/CryptoType';
import TransferType from '../enums/TransferType';
import { purchaseProduct, sendCryptoAsset } from './createTransction';
import useTxHandler from '../hooks/useTxHandler';
import PriceContext from '../contexts/PriceContext';
import WalletContext from '../contexts/WalletContext';
import NetworkType from '../enums/NetworkType';
import useErcContract from '../hooks/useErcContract';

export default function createTransferTx(
  type: CryptoType,
  transferType: TransferType,
  contract: Contract | null,
  // gasPrice: string,
  // bscGasPrice: string,
  // getCryptoPrice: (cryptoType: CryptoType) => number,
  // wallet: Wallet | undefined,
  // addPendingTransaction: (
  //   txRes: ethers.providers.TransactionResponse | undefined,
  //   tx: CryptoTransaction,
  // ) => void,
  // productId?: number,
  // valuesFrom?: string,
  // valuesTo?: string,
  // accelerate?: Accelerate,
  // address?: string,
  // updateGasPrice?: string,
) {
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { wallet } = useContext(WalletContext);
  // const { addPendingTransaction } = useContext(TransactionContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resTx, setResTx] = useState<TransactionResponse>();
  const { afterTxHashCreated, afterTxCreated, afterTxFailed } = useTxHandler();
  const navigation = useNavigation();
  const { elContract, elfiContract, daiContract } = useErcContract();

  const setErcContract = (type: CryptoType) => {
    if (type === CryptoType.ELFI) {
      return elfiContract;
    } else if (type === CryptoType.DAI) {
      return daiContract;
    } else {
      return elContract;
    }
  };
  const notifyFail = () => {
    navigation.goBack();
    afterTxFailed('Transaction failed');
  };

  const noticeWait = () => {
    afterTxHashCreated(
      resTx?.from || '',
      resTx?.to || '',
      resTx?.hash || '',
      NetworkType.ETH,
    );
  };

  const transferValue = async (
    valuesFrom: string,
    valuesTo: string,
    address?: string,
  ) => {
    try {
      setIsLoading(true);
      if (transferType === TransferType.Purchase) {
        setResTx(
          await purchaseProduct(
            gasPrice,
            bscGasPrice,
            type,
            contract || null,
            valuesFrom || '',
            wallet,
            getCryptoPrice,
            // updateGasPrice,
            // accelerate,
          ),
        );
      } else {
        const ercContract = setErcContract(type);
        setResTx(
          await sendCryptoAsset(
            gasPrice,
            bscGasPrice,
            type,
            address,
            valuesTo,
            wallet,
            ercContract,
            // updateGasPrice,
            // accelerate,
          ),
        );
      }
      // const isTransferTypePurchase = transferType === TransferType.Purchase;
      // addPendingTransaction(txRes, {
      //   txHash: txRes?.hash,
      //   cryptoType: isTransferTypePurchase ? CryptoType.ELA : type,
      //   value: valuesTo || '',
      //   createdAt: '',
      //   type: isTransferTypePurchase ? 'in' : 'out',
      //   blockNumber: 0,
      //   productId: isTransferTypePurchase ? productId : 0,
      //   toAddress: address,
      //   valueFrom: isTransferTypePurchase ? valuesFrom : '',
      // });
    } catch (e) {
      throw Error;
      // notifyFail();
    }
  };

  const waitTx = async () => {
    try {
      await resTx?.wait();
      afterTxCreated(resTx?.hash || '', NetworkType.ETH);
    } catch (error) {
      throw Error;
      notifyFail();
    }
  };

  useEffect(() => {
    if (resTx) {
      setIsLoading(false);
      navigation.goBack();
      noticeWait();
      waitTx();
    }
  }, [resTx]);

  return { isLoading, transferValue };
}
