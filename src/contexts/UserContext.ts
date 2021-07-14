import { createContext } from 'react';
import { SignInStatus, SignOut } from '../enums/SignInStatus';
import Notification from '../types/Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import { OwnershipResponse } from '../types/AccountResponse';
import ProviderType from '../enums/ProviderType';
import Server from '../api/server';

export type UserContextState = {
  signedIn: SignInStatus;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    ethAddresses: string[];
    expoPushTokens: string[];
    nationality: string;
    legacyEl: number;
    legacyUsd: number;
    legacyWalletRefundStatus: LegacyRefundStatus;
    legacyAsset2Value: number;
    language: string;
    provider: ProviderType;
  };
  ownerships: OwnershipResponse[];
  balance: string;
  notifications: Notification[];
  expoPushToken: string;
  isWalletUser: boolean;
  Server: Server;
};

export interface IUserContext extends UserContextState {
  signIn: () => void;
  guestSignIn: () => void;
  signOut: (signInStatus: SignOut) => void;
  refreshUser: () => Promise<void>;
  setNotifications: (notifications: Notification[]) => void;
  setEthAddress: (address: string) => void;
  setUserExpoPushToken: (expoPushToken: string) => void;
  setRefundStatus: (legacyRefundStatus: LegacyRefundStatus) => void;
  newWalletUser: () => void;
}

export const initialUserState: UserContextState = {
  signedIn: SignInStatus.PENDING,
  user: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    ethAddresses: [],
    expoPushTokens: [],
    nationality: 'South Korea, KOR',
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
    legacyAsset2Value: 0,
    language: 'ko',
    provider: ProviderType.GUEST,
  },
  ownerships: [],
  balance: '0',
  notifications: [] as Notification[],
  expoPushToken: '',
  isWalletUser: false,
  Server: new Server(() => {}, ''),
};

const UserContext = createContext<IUserContext>({
  ...initialUserState,
  signIn: async () => {},
  guestSignIn: async () => {},
  signOut: async (_signInStatus: SignOut) => {},
  refreshUser: async () => {},
  setNotifications: (_notifications: Notification[]) => {},
  setEthAddress: (_address: string) => {},
  setUserExpoPushToken: (_expoPushToken: string) => {},
  setRefundStatus: (_legacyRefundStatus: LegacyRefundStatus) => {},
  newWalletUser: () => {},
});

export default UserContext;
