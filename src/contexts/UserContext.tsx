import { createContext } from 'react';
import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';

const UserContext = createContext({
  signedIn: false,
  locale: LocaleType.EN,
  user: {
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    kycStatus: KycStatus.NONE,
  },
  unreadNotificationCount: 0,
  signIn: async () => { },
  signOut: async () => { },
});

export default UserContext;
