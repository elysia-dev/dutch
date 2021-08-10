import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import PriceContext from '../contexts/PriceContext';
import TransactionContext from '../contexts/TransactionContext';
import WalletContext from '../contexts/WalletContext';
import Accelerate from '../enums/Accelerate';
import CryptoType from '../enums/CryptoType';
import NetworkType from '../enums/NetworkType';
import TransferType from '../enums/TransferType';
import TxStatus from '../enums/TxStatus';
import { purchaseProduct, sendCryptoAsset } from '../utiles/createTransction';
import { provider, bscProvider } from '../utiles/getContract';

export function useTransferTx(type: CryptoType, productId?: number) {
  const { gasPrice, bscGasPrice, getCryptoPrice } = useContext(PriceContext);
  const { addPendingTransaction } = useContext(TransactionContext);
  const { wallet } = useContext(WalletContext);
  const navigation = useNavigation();
  const [transferInfo, setTransferInfo] = useState<{
    transferType: TransferType;
    contract: ethers.Contract | null;
    valuesFrom: string;
    valuesTo: string;
    address?: string;
    updateGasPrice?: string;
    accelerate?: Accelerate;
  }>({
    transferType: TransferType.NONE,
    contract: null,
    valuesFrom: '',
    valuesTo: '',
    address: '',
    updateGasPrice: '',
  });

  const changeSetTransfer = (
    transferType: TransferType,
    contract: ethers.Contract | null,
    valuesFrom: string,
    valuesTo: string,
    accelerate?: Accelerate,
    address?: string,
    updateGasPrice?: string,
  ) => {
    setTransferInfo({
      transferType: transferType,
      contract,
      valuesFrom: valuesFrom,
      valuesTo: valuesTo,
      address: address,
      updateGasPrice: updateGasPrice,
      accelerate: accelerate,
    });
  };

  useEffect(() => {
    if (transferInfo.transferType === TransferType.NONE) return;
    (async () => {
      try {
        let txRes: ethers.providers.TransactionResponse | undefined;
        if (transferInfo.accelerate !== Accelerate.Accelerate)
          navigation.goBack();
        if (transferInfo.transferType === TransferType.PurChase) {
          txRes = await purchaseProduct(
            gasPrice,
            bscGasPrice,
            type,
            transferInfo.contract,
            transferInfo.valuesFrom,
            wallet,
            getCryptoPrice,
            transferInfo.updateGasPrice,
            transferInfo.accelerate,
          );
        } else {
          txRes = await sendCryptoAsset(
            gasPrice,
            bscGasPrice,
            type,
            transferInfo.address,
            transferInfo.valuesTo,
            wallet,
            transferInfo.updateGasPrice,
            transferInfo.accelerate,
          );
        }
        const isTransferTypePurchase =
          transferInfo.transferType === TransferType.PurChase;
        addPendingTransaction(txRes, {
          txHash: txRes?.hash,
          cryptoType: isTransferTypePurchase ? CryptoType.ELA : type,
          value: transferInfo.valuesTo,
          createdAt: '',
          type: isTransferTypePurchase ? 'in' : 'out',
          blockNumber: 0,
          productId: isTransferTypePurchase ? productId : 0,
          toAddress: transferInfo.address,
          valueFrom: isTransferTypePurchase ? transferInfo.valuesFrom : '',
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [transferInfo]);

  return changeSetTransfer;
}
