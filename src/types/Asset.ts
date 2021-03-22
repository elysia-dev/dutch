import CryptoType from "../enums/CryptoType"

type Asset = {
  type: CryptoType;
  title: string;
  currencyValue: number;
  unitValue: number;
  unit: string;
  ownershipId?: string;
  productId?: string;
  isLegacyOwnership?: boolean;
}

export default Asset