export type WaitingTransaction = {
  transferType: string;
  date: string;
  unit?: string;
  nonce?: number;
  txHash?: string;
  amount?: string;
  cryptoType?: string;
};
