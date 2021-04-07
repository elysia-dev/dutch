import CryptoType from "../enums/CryptoType"

type Asset = {
  type: CryptoType;
  title: string;
  value: number;
  unit: string;
  ownershipId?: number;
  productId?: number;
  isLegacyOwnership?: boolean;
  address?: string;
}

export default Asset