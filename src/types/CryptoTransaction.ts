type CryptoTransaction = {
  type: 'in' | 'out' | 'reward',
  legacyType?: 'ownership' | 'refund' | 'profit' | 'expectedProfit' | 'close' | string,
  value: string,
  txHash?: string,
  createdAt: string,
}

export default CryptoTransaction