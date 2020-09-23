import { KycStatus } from '../enums/KycStatus';

export type AccountResponse = {
  verificationId?: string;
  status?: string;
  token?: string;
  counts?: number;
};

export type UserResponse = {
  user: {
    email: string;
    kycStatus: KycStatus;
    ethAddress: string[];
    gender: string;
    firstName: string;
    lastName: string;
    language: string;
  };
  ownerships: [
    {
      title: string;
      productType: string;
      value: number;
      profit: number;
    },
  ];
  unreadNotificationCount: number;
};
