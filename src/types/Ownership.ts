import Product, { defaultProduct } from './Product';

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

export const defaultOwnershipResponse = {
  value: '',
  expectProfit: '',
  availableProfit: '',
  stake: '',
  product: defaultProduct,
  isLegacy: false,
  legacyPaymentMethod: '',
  legacyRefundStatus: '',
};
