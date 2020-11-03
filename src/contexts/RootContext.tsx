import { createContext } from 'react';
import Server from '../api/server';
import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';
import { SignInStatus } from '../enums/LoginStatus';
import Notification from '../types/Notification';

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
    nationality: string;
  };
  changeLanguage: (input: LocaleType) => void;
  setKycStatus: () => void;
  signIn: () => void;
  signOut: () => void;
  autoSignOut: () => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  setEthAddress: (address: string) => void;
  Server: Server;
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
    language: LocaleType.EN,
    nationality: 'South Korea, KOR',
  },
  changeLanguage: () => { },
  setKycStatus: () => { },
  signIn: async () => { },
  signOut: async () => { },
  autoSignOut: async () => { },
  notifications: [] as Notification[],
  setNotifications: (notifications: Notification[]) => { },
  setEthAddress: (address: string) => { },
  Server: new Server(() => { }, ''),
});

export default RootContext;
