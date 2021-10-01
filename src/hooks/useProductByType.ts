import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useNavigation } from '@react-navigation/native';
import { BigNumber, constants } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import PriceContext from '../contexts/PriceContext';
import TransactionContext from '../contexts/TransactionContext';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import NetworkType from '../enums/NetworkType';
import TransferType from '../enums/TransferType';
import { WaitingTransaction } from '../types/WaitingTransaction';
import { getAssetTokenFromCryptoType } from '../utiles/getContract';
import useTxHandler from './useTxHandler';
import useWaitTx from './useWaitTx';

const useProductByType = (
  assetInCryptoType: CryptoType,
  contractAddress: string,
  productUnit: string,
) => {
  const { setIsSuccessTx } = useContext(TransactionContext);
  const [resTx, setResTx] = useState<TransactionResponse>();
  const { afterTxHashCreated, afterTxCreated, afterTxFailed } = useTxHandler();
  const { wallet } = useContext(WalletContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { waitingTxs, setWaitingTx, removeStorageTx } = useWaitTx(
    assetInCryptoType,
    productUnit,
  );
  const contract = getAssetTokenFromCryptoType(
    assetInCryptoType,
    contractAddress,
  );

  const navigation = useNavigation();

  const notifyFail = () => {
    navigation.goBack();
    afterTxFailed('Transaction failed');
  };

  const waitTx = async () => {
    try {
      await resTx?.wait();
      setIsSuccessTx(true);
      removeStorageTx(resTx?.hash);
      afterTxCreated(resTx?.hash || '', NetworkType.ETH);
    } catch (error) {
      throw Error;
    }
  };

  const getLastNonce = () => {
    let txs: WaitingTransaction[];
    if (assetInCryptoType === CryptoType.BNB) {
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

  const productByType = async (
    inFiat: string,
    inToken: string,
    type: TransferType,
  ) => {
    let lastNonce: number | undefined;
    if (waitingTxs) {
      lastNonce = getLastNonce();
    }
    setIsSuccessTx(false);
    let res: TransactionResponse | undefined;
    try {
      switch (type) {
        case TransferType.Purchase:
          res = await purcahse(inFiat, lastNonce);
          setResTx(res);
          break;
        case TransferType.Refend:
          res = await refund(inToken);
          setResTx(res);
          break;
        case TransferType.ProductReward:
          res = await reward();
          setResTx(res);
          break;
        default:
          break;
      }
      setWaitingTx(type, inToken, res);
    } catch (error) {
      console.log(error);
      throw Error;
    }
  };

  const purcahse = async (inFiat: string, lastNonce?: number) => {
    const valueInDollar = String(getCryptoPrice(assetInCryptoType));
    const sendedValue = utils
      .parseEther(inFiat)
      .mul(constants.WeiPerEther)
      .div(utils.parseEther(valueInDollar));
    if (assetInCryptoType !== CryptoType.EL) {
      return purchaseNotErcProduct(sendedValue, lastNonce);
    } else {
      return purchaseErcProduct(sendedValue, lastNonce);
    }
  };

  const purchaseNotErcProduct = async (
    sendedValue: BigNumber,
    lastNonce?: number,
  ) => {
    const populatedTransaction = await contract?.populateTransaction.purchase();

    if (!populatedTransaction) return;

    return await wallet?.getFirstSigner(assetInCryptoType).sendTransaction({
      to: populatedTransaction.to,
      data: populatedTransaction.data,
      value: sendedValue, // dollar to crypto
      gasPrice:
        assetInCryptoType === CryptoType.BNB
          ? BigNumber.from(bscGasPrice)
          : BigNumber.from(gasPrice),
      nonce: lastNonce ? lastNonce + 1 : undefined,
    });
  };

  const purchaseErcProduct = async (
    sendedValue: BigNumber,
    lastNonce?: number,
  ) => {
    const populatedTransaction = await contract?.populateTransaction.purchase(
      sendedValue,
    );
    if (!populatedTransaction) return;
    return await wallet?.getFirstSigner().sendTransaction({
      to: populatedTransaction.to,
      data: populatedTransaction.data,
      gasPrice: BigNumber.from(gasPrice),
      nonce: lastNonce ? lastNonce + 1 : undefined,
    });
  };

  const refund = async (inToken: string, lastNonce?: number) => {
    try {
      const populatedTransaction = await contract?.populateTransaction.refund(
        inToken,
      );

      if (!populatedTransaction) return;

      return await wallet?.getFirstSigner(assetInCryptoType).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
        nonce: lastNonce ? lastNonce + 1 : undefined,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const reward = async (lastNonce?: number) => {
    try {
      const populatedTransaction =
        await contract?.populateTransaction.claimReward();

      if (!populatedTransaction) return;

      return await wallet?.getFirstSigner(assetInCryptoType).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
        nonce: lastNonce ? lastNonce + 1 : undefined,
      });
    } catch (error) {
      console.log(error);
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

  return { contract, productByType };
};

export default useProductByType;
