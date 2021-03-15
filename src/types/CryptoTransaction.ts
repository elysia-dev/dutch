type CryptoTransaction = {
  type: 'in' | 'out',
  value: string,
  txHash: string,
  createdAt: Date,
}

export default CryptoTransaction