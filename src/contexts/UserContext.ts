import { createContext } from 'react';
import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';
import { SignInStatus } from '../enums/SignInStatus';
import Notification from '../types/Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import CurrencyType from '../enums/CurrencyType';
import { OwnershipResponse } from '../types/AccountResponse';
import ProviderType from '../enums/ProviderType';
import { currentLocalization } from '../utiles/currentLocale';

type UserContextType = {
  signedIn: SignInStatus;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: KycStatus;
    gender: string;
    language: LocaleType;
    currency: CurrencyType;
    ethAddresses: string[];
    expoPushTokens: string[];
    nationality: string;
    legacyEl: number;
    legacyUsd: number;
    legacyWalletRefundStatus: LegacyRefundStatus;
    legacyAsset2Value: number;
    provider: ProviderType;
  };
  ownerships: OwnershipResponse[];
  balance: string;
  notifications: Notification[];
  expoPushToken: string;
};

const UserContext = createContext<UserContextType>({
  signedIn: SignInStatus.PENDING,
  user: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    kycStatus: KycStatus.NONE,
    ethAddresses: [],
    expoPushTokens: [],
    language: currentLocalization(),
    currency: CurrencyType.USD,
    nationality: 'South Korea, KOR',
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
    legacyAsset2Value: 0,
    provider: ProviderType.GUEST,
  },
  ownerships: [],
  balance: '0',
  notifications: [] as Notification[],
  expoPushToken: '',
});

export default UserContext;
