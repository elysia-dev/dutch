export type Transaction = {
  id: number;
  ownershipId?: number;
  value: string;
  hash: string;
  transactionType: string;
  createdAt: string;
};
