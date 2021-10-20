export type WaitingTransaction = {
  transferType: string;
  date: string;
  unit?: string;
  nonce?: number;
  hash?: string;
  amount?: string;
  cryptoType?: string;
  migrationInfo?: WaitingTransaction[];
  migrationRewardAmount?: string;
  migrationUnstakingAmount?: string;
};

export type ToastTransaction = {
  id: number;
  transferType: string;
  isSuccessTx: boolean;
  isFailTx: boolean;
  isWaitingTx: boolean;
};
