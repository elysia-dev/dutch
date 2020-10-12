import { createContext } from 'react';
import { espressoClient } from '../api/axiosInstances';
import Server from '../api/server';
import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';
import Notification from '../types/Notification';

const RootContext = createContext({
  signedIn: false,
  locale: LocaleType.EN,
  user: {
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    kycStatus: KycStatus.NONE,
  },
  signIn: async () => {},
  signOut: async () => {},
  notifications: [] as Notification[],
  unreadNotificationCount: 0,
  setUnreadNotificationCount: (value: number) => {},
  setNotifications: (notifications: Notification[]) => {},
  Server: new Server(() => {}),
});

export default RootContext;
