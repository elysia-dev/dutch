export type Transaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
};

type CryptoTxsResponse = {
  tx: Transaction[];
};

export type CryptoTxsResultResponse = {
  result: Transaction[];
};

export default CryptoTxsResponse;
