import { createContext } from 'react';
import Server from '../api/server';
import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';
import { SignInStatus } from '../enums/LoginStatus';
import Notification from '../types/Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import CurrencyType from '../enums/CurrencyType';
import { CurrencyResponse } from '../types/CurrencyResponse';
import { OwnershipResponse } from '../types/AccountResponse';

type RootContextType = {
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
  };
  ownerships: OwnershipResponse[];
  balance: string;
  changeLanguage: (input: LocaleType) => void;
  changeCurrency: (input: CurrencyType) => void;
  setKycStatus: () => void;
  signIn: () => void;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  autoSignOut: (withdrawn?: boolean) => void;
  notifications: Notification[];
  setCurrencyPrice: (currency: CurrencyResponse[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  setEthAddress: (address: string) => void;
  setUserExpoPushToken: (expoPushToken: string) => void;
  setRefundStatus: (legacyRefundStatus: LegacyRefundStatus) => void;
  Server: Server;
  expoPushToken: string;
  elPrice: number;
  krwPrice: number;
  cnyPrice: number;
  currencyUnit: string;
  currencyRatio: number;
};

const RootContext = createContext<RootContextType>({
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
    language: LocaleType.EN,
    currency: CurrencyType.USD,
    nationality: 'South Korea, KOR',
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
  },
  ownerships: [],
  balance: '0',
  changeLanguage: () => {},
  changeCurrency: () => {},
  setKycStatus: () => {},
  signIn: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
  autoSignOut: async (withdrawn?: boolean) => {},
  notifications: [] as Notification[],
  setCurrencyPrice: (currency: CurrencyResponse[]) => {},
  setNotifications: (notifications: Notification[]) => {},
  setEthAddress: (address: string) => {},
  setUserExpoPushToken: (expoPushToken: string) => {},
  setRefundStatus: (legacyRefundStatus: LegacyRefundStatus) => {},
  Server: new Server(() => {}, ''),
  expoPushToken: '',
  elPrice: 0,
  krwPrice: 0,
  cnyPrice: 0,
  currencyUnit: '$',
  currencyRatio: 1,
});

export default RootContext;
