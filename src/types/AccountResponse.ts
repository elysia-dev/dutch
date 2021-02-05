import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';
import Notification from './Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import CurrencyType from '../enums/CurrencyType';
import ProviderType from '../enums/ProviderType';

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
};

export type UserResponse = {
  user: {
    id: number;
    email: string;
    kycStatus: KycStatus;
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
    provider: ProviderType;
  };
  totalBalance: string;
  ownerships: OwnershipResponse[];
  notifications: Notification[];
};
