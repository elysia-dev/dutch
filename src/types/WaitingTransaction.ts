export type WaitingTransaction = {
  transferType: string;
  date: string;
  unit?: string;
  nonce?: number;
  txHash?: string;
  amount?: string;
  cryptoType?: string;
};

export type ToastTransaction = {
  id: number;
  transferType: string;
  isSuccessTx: boolean;
  isFailTx: boolean;
  isWaitingTx: boolean;
};
