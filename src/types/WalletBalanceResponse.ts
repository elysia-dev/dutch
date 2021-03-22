import CryptoType from "../enums/CryptoType";

type TokenBalance = {
  name: string,
  balance: number,
  symbol: CryptoType | string,
}

type WalletBalanceResponse = {
  ethBalance: number,
  tokens: TokenBalance[]
}

export default WalletBalanceResponse