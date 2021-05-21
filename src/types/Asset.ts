import CryptoType from "../enums/CryptoType"
import PaymentCryptoType from "../enums/PaymentCryptoType"

type Asset = {
  type: CryptoType;
  title: string;
  value: number;
  unit: string;
  ownershipId?: number;
  productId?: number;
  isLegacyOwnership?: boolean;
  address?: string;
  image?: string;
  paymentMethod?: CryptoType | PaymentCryptoType | string;
}

export const defaultAsset: Asset = {
  type: CryptoType.ETH,
  title: "ETH",
  value: 0,
  unit: 'ETH',
}

export default Asset