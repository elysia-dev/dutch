export type Transaction = {
  blocknumber: string;
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

export default CryptoTxsResponse;
