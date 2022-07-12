import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber, constants } from 'ethers';
import { useContext } from 'react';
import PriceContext from '../contexts/PriceContext';
import TransactionContext from '../contexts/TransactionContext';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import TransferType from '../enums/TransferType';
import { WaitingTransaction } from '../types/WaitingTransaction';
import { getAssetTokenFromCryptoType } from '../utiles/getContract';

const useProductByType = (
  assetCryptoType: CryptoType,
  contractAddress: string,
  type: TransferType,
) => {
  const { wallet } = useContext(WalletContext);
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { waitingTxs } = useContext(TransactionContext);
  const contract = getAssetTokenFromCryptoType(
    assetCryptoType,
    contractAddress,
  );

  const getLastNonce = () => {
    let txs: WaitingTransaction[];
    if (assetCryptoType === CryptoType.BNB) {
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

  const createTransaction = async (inFiat: string, inToken: string) => {
    let lastNonce: number | undefined;
    if (waitingTxs) {
      lastNonce = getLastNonce();
    }
    let res: TransactionResponse | undefined;
    try {
      switch (type) {
        case TransferType.Purchase:
          res = await purcahse(inFiat, lastNonce);
          break;
        case TransferType.Refund:
          res = await refund(inToken);
          break;
        case TransferType.ProductReward:
          res = await reward();
          break;
        default:
          break;
      }
      return res;
    } catch (error) {
      throw Error;
    }
  };

  const purcahse = async (inFiat: string, lastNonce?: number) => {
    const valueInDollar = String(getCryptoPrice(assetCryptoType));
    const amount = utils
      .parseEther(inFiat)
      .mul(constants.WeiPerEther)
      .div(utils.parseEther(valueInDollar));
    if (assetCryptoType !== CryptoType.EL) {
      return await purchaseNotErcProduct(amount, lastNonce);
    } else {
      return await purchaseErcProduct(amount, lastNonce);
    }
  };

  const purchaseNotErcProduct = async (
    amount: BigNumber,
    lastNonce?: number,
  ) => {
    const populatedTransaction = await contract?.populateTransaction.purchase();

    if (!populatedTransaction) return;

    return await wallet?.getFirstSigner(assetCryptoType).sendTransaction({
      to: populatedTransaction.to,
      data: populatedTransaction.data,
      value: amount, // dollar to crypto
      gasPrice:
        assetCryptoType === CryptoType.BNB
          ? BigNumber.from(bscGasPrice)
          : BigNumber.from(gasPrice),
      nonce: lastNonce ? lastNonce + 1 : undefined,
    });
  };

  const purchaseErcProduct = async (amount: BigNumber, lastNonce?: number) => {
    const populatedTransaction = await contract?.populateTransaction.purchase(
      amount,
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
        utils.parseEther(inToken),
      );

      if (!populatedTransaction) return;

      return await wallet?.getFirstSigner(assetCryptoType).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
        nonce: lastNonce ? lastNonce + 1 : undefined,
      });
    } catch (error) {
      throw Error;
    }
  };

  const reward = async (lastNonce?: number) => {
    try {
      const populatedTransaction =
        await contract?.populateTransaction.claimReward();

      if (!populatedTransaction) return;

      return await wallet?.getFirstSigner(assetCryptoType).sendTransaction({
        to: populatedTransaction.to,
        data: populatedTransaction.data,
        nonce: lastNonce ? lastNonce + 1 : undefined,
      });
    } catch (error) {
      throw Error;
    }
  };

  return { contract, createTransaction };
};

export default useProductByType;
