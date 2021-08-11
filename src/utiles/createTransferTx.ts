import { ethers } from 'ethers';
import Wallet from '../core/Wallet';
import Accelerate from '../enums/Accelerate';
import CryptoType from '../enums/CryptoType';
import TransferType from '../enums/TransferType';
import CryptoTransaction from '../types/CryptoTransaction';
import { purchaseProduct, sendCryptoAsset } from './createTransction';

export default async function createTransferTx(
  gasPrice: string,
  bscGasPrice: string,
  getCryptoPrice: (cryptoType: CryptoType) => number,
  wallet: Wallet | undefined,
  addPendingTransaction: (
    txRes: ethers.providers.TransactionResponse | undefined,
    tx: CryptoTransaction,
  ) => void,
  type: CryptoType,
  transferType: TransferType,
  productId?: number,
  contract?: ethers.Contract | null,
  valuesFrom?: string,
  valuesTo?: string,
  accelerate?: Accelerate,
  address?: string,
  updateGasPrice?: string,
) {
  if (transferType === TransferType.None) return;
  try {
    let txRes: ethers.providers.TransactionResponse | undefined;
    if (transferType === TransferType.Purchase) {
      txRes = await purchaseProduct(
        gasPrice,
        bscGasPrice,
        type,
        contract || null,
        valuesFrom || '',
        wallet,
        getCryptoPrice,
        updateGasPrice,
        accelerate,
      );
    } else {
      txRes = await sendCryptoAsset(
        gasPrice,
        bscGasPrice,
        type,
        address,
        valuesTo,
        wallet,
        updateGasPrice,
        accelerate,
      );
    }
    const isTransferTypePurchase = transferType === TransferType.Purchase;
    addPendingTransaction(txRes, {
      txHash: txRes?.hash,
      cryptoType: isTransferTypePurchase ? CryptoType.ELA : type,
      value: valuesTo || '',
      createdAt: '',
      type: isTransferTypePurchase ? 'in' : 'out',
      blockNumber: 0,
      productId: isTransferTypePurchase ? productId : 0,
      toAddress: address,
      valueFrom: isTransferTypePurchase ? valuesFrom : '',
    });
  } catch (e) {
    console.log(e);
  }
}
