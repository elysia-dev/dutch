import Product from './product';

export type OwnershipResponse = {
  value: string;
  expectProfit: string;
  availableProfit: string;
  stake: string;
  product: Product;
  isLegacy: boolean;
  legacyPaymentMethod: string;
  legacyRefundStatus: string;
};
