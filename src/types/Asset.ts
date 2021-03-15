import CryptoType from "../enums/CryptoType"

type Asset = {
  type: CryptoType;
  title: string;
  currencyValue: string;
  unitValue: string;
}

export default Asset