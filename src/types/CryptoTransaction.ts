import CryptoType from '../enums/CryptoType';
import TxStatus from '../enums/TxStatus';

type CryptoTransaction = {
  type: 'in' | 'out' | 'reward' | 'fail';
  legacyType?:
    | 'ownership'
    | 'refund'
    | 'profit'
    | 'expectedProfit'
    | 'close'
    | string;
  value: string;
  txHash?: string;
  createdAt: string;
  blockNumber: number | undefined;
  status?: TxStatus;
  cryptoType?: CryptoType;
  productId?: number;
  valueFrom?: string;
  toAddress?: string;
  faliTxStatus?: number;
};

export default CryptoTransaction;
