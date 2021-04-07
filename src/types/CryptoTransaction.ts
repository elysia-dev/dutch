import CryptoType from "../enums/CryptoType"
import TxStatus from "../enums/TxStatus"

type CryptoTransaction = {
  type: 'in' | 'out' | 'reward',
  legacyType?: 'ownership' | 'refund' | 'profit' | 'expectedProfit' | 'close' | string,
  value: string,
  txHash?: string,
  createdAt: string,
  status?: TxStatus,
  cryptoType?: CryptoType;
}

export default CryptoTransaction