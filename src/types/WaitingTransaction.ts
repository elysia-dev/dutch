export type WaitingTransaction = {
  transferType: string;
  unit: string;
  date: string;
  nonce?: number;
  txHash?: string;
  amount?: string;
};
