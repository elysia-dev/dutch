import CryptoType from "../enums/CryptoType";

type TokenBalance = {
  name: string,
  balance: number,
  symbol: CryptoType | string,
  address: string,
}

type WalletBalanceResponse = {
  ethBalance: number,
  bnbBalance: number,
  tokens: TokenBalance[]
}

export default WalletBalanceResponse