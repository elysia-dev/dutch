import CryptoType from "../enums/CryptoType";

type BalanceItem = {
  name: string,
  balance: number,
  symbol: CryptoType | string,
}

export default BalanceItem