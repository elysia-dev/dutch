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
  value: '0',
  expectProfit: '0',
  availableProfit: '0',
  stake: '0',
  product: defaultProduct,
  isLegacy: false,
  legacyPaymentMethod: '',
  legacyRefundStatus: '',
};
