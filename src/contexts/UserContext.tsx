import React, { createContext } from 'react';
import * as Localization from 'expo-localization';
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
  signIn: async () => {},
  signOut: async () => {},
});

export default UserContext;
