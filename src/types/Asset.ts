import CryptoType from "../enums/CryptoType"

type Asset = {
  type: CryptoType;
  title: string;
  currencyValue: string;
  unitValue: string;
  unit: string;
}

export default Asset