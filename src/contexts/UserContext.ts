import { createContext } from 'react';
import { SignInStatus } from '../enums/SignInStatus';
import Notification from '../types/Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import { OwnershipResponse } from '../types/AccountResponse';
import ProviderType from '../enums/ProviderType';

type UserContextType = {
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
    provider: ProviderType;
  };
  ownerships: OwnershipResponse[];
  balance: string;
  notifications: Notification[];
  expoPushToken: string;
  isWalletUser: boolean;
};

const UserContext = createContext<UserContextType>({
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
    provider: ProviderType.GUEST,
  },
  ownerships: [],
  balance: '0',
  notifications: [] as Notification[],
  expoPushToken: '',
  isWalletUser: false,
});

export default UserContext;
