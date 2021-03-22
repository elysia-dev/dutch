import CryptoType from "../enums/CryptoType"

type Asset = {
  type: CryptoType;
  title: string;
  currencyValue: number;
  unitValue: number;
  unit: string;
  ownershipId?: number;
  productId?: number;
  isLegacyOwnership?: boolean;
}

export default Asset