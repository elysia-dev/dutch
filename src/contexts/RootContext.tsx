import { createContext } from 'react';
import Server from '../api/server';
import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';
import { SignInStatus } from '../enums/LoginStatus';
import Notification from '../types/Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';

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
    ethAddresses: string[];
    expoPushTokens: string[];
    nationality: string;
    legacyEl: number;
    legacyUsd: number;
    legacyWalletRefundStatus: LegacyRefundStatus;
  };
  changeLanguage: (input: LocaleType) => void;
  setKycStatus: () => void;
  signIn: () => void;
  signOut: () => void;
  autoSignOut: () => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  setEthAddress: (address: string) => void;
  setUserExpoPushToken: (expoPushToken: string) => void;
  setWithdrawAddress: (address: string, email: string) => void;
  setRefundStatus: (legacyRefundStatus: LegacyRefundStatus) => void;
  Server: Server;
  expoPushToken: string;
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
    nationality: 'South Korea, KOR',
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
  },
  changeLanguage: () => { },
  setKycStatus: () => { },
  signIn: async () => { },
  signOut: async () => { },
  autoSignOut: async () => { },
  notifications: [] as Notification[],
  setNotifications: (notifications: Notification[]) => { },
  setEthAddress: (address: string) => { },
  setUserExpoPushToken: (expoPushToken: string) => { },
  setWithdrawAddress: (address: string, email: string) => { },
  setRefundStatus: (legacyRefundStatus: LegacyRefundStatus) => { },
  Server: new Server(() => { }, ''),
  expoPushToken: "",
});

export default RootContext;
