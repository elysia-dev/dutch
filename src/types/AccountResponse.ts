import LocaleType from '../enums/LocaleType';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import CurrencyType from '../enums/CurrencyType';
import ProviderType from '../enums/ProviderType';
import Product from './Product';

export type AccountResponse = {
  verificationId?: string;
  status?: string;
  token?: string;
  counts?: number;
};

export type OwnershipResponse = {
  id: number;
  isLegacy: boolean;
  title: string;
  productType: string;
  value: number;
  profit: number;
  tokenValue: number;
  product: Product;
};

export type UserResponse = {
  user: {
    id: number;
    email: string;
    ethAddresses: string[];
    expoPushTokens: string[];
    gender: string;
    firstName: string;
    lastName: string;
    language: LocaleType;
    currency: CurrencyType;
    nationality: string;
    legacyEl: number;
    legacyUsd: number;
    legacyWalletRefundStatus: LegacyRefundStatus;
    legacyAsset2Value: number;
    provider: ProviderType;
  };
  totalBalance: string;
  ownerships: OwnershipResponse[];
};
