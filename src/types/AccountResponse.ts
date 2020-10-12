import { KycStatus } from '../enums/KycStatus';
import LocaleType from '../enums/LocaleType';

export type AccountResponse = {
  verificationId?: string;
  status?: string;
  token?: string;
  counts?: number;
};

export type UserResponse = {
  user: {
    id: number;
    email: string;
    kycStatus: KycStatus;
    ethAddresses: string[];
    gender: string;
    firstName: string;
    lastName: string;
    language: LocaleType;
  };
  totalBalance: string;
  ownerships: [
    {
      id: number;
      title: string;
      productType: string;
      value: number;
      profit: number;
    },
  ];
  unreadNotificationCount: number;
};
