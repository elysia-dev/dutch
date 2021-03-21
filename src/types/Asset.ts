import CryptoType from "../enums/CryptoType"

type Asset = {
  type: CryptoType;
  title: string;
  currencyValue: number;
  unitValue: number;
  unit: string;
}

export default Asset