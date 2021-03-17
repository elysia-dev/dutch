import { createContext } from 'react';
import Server from '../api/server';
import LocaleType from '../enums/LocaleType';
import { SignOut } from '../enums/SignInStatus';
import Notification from '../types/Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import CurrencyType from '../enums/CurrencyType';
import { CurrencyResponse } from '../types/CurrencyResponse';

type FunctionContextType = {
  setLanguage: (input: LocaleType) => void;
  setCurrency: (input: CurrencyType) => void;
  signIn: () => void;
  guestSignIn: () => void;
  signOut: (signInStatus: SignOut) => void;
  refreshUser: () => Promise<void>;
  setCurrencyPrice: (currency: CurrencyResponse[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  setEthAddress: (address: string) => void;
  setUserExpoPushToken: (expoPushToken: string) => void;
  setRefundStatus: (legacyRefundStatus: LegacyRefundStatus) => void;
  setIsWalletUser: (isWalletUser: boolean) => void;
  newWalletUser: () => void;
  Server: Server;
};

const FunctionContext = createContext<FunctionContextType>({
  setLanguage: () => { },
  setCurrency: () => { },
  signIn: async () => { },
  guestSignIn: async () => { },
  signOut: async (_signInStatus: SignOut) => { },
  refreshUser: async () => { },
  setCurrencyPrice: (_currency: CurrencyResponse[]) => { },
  setNotifications: (_notifications: Notification[]) => { },
  setEthAddress: (_address: string) => { },
  setUserExpoPushToken: (_expoPushToken: string) => { },
  setRefundStatus: (_legacyRefundStatus: LegacyRefundStatus) => { },
  setIsWalletUser: (_isWalletUser: boolean) => { },
  newWalletUser: () => { },
  Server: new Server(() => { }, ''),
});

export default FunctionContext;
