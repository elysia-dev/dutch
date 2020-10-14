import { createContext } from 'react';
import { espressoClient } from '../api/axiosInstances';
import Server from '../api/server';
import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';
import Notification from '../types/Notification';

type RootContextType = {
  signedIn: boolean;
  locale: LocaleType;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: KycStatus;
    gender: string;
    language: LocaleType;
    ethAddresses: string[];
  };
  signIn: () => void;
  signOut: () => void;
  autoSignOut: () => void;
  unreadNotificationCount: number;
  notifications: Notification[];
  setUnreadNotificationCount: (value: number) => void;
  setNotifications: (notifications: Notification[]) => void;
  Server: Server;
}

const RootContext = createContext<RootContextType>({
  signedIn: false,
  locale: LocaleType.KO,
  user: {
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    kycStatus: KycStatus.NONE,
    ethAddresses: [],
    language: LocaleType.KO,
  },
  signIn: async () => { },
  signOut: async () => { },
  autoSignOut: async () => { },
  notifications: [] as Notification[],
  unreadNotificationCount: 0,
  setUnreadNotificationCount: (value: number) => { },
  setNotifications: (notifications: Notification[]) => { },
  Server: new Server(() => { }, ''),
});

export default RootContext;
