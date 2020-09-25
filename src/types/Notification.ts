import NotificationType from '../enums/NotificationType';

export type NotificationResponse = {
  id: number;
  notificationType: NotificationType;
  status: string;
  data: {
    reportId?: string;
    ownershipId?: number;
    productId?: number;
    month?: number;
    week?: number;
    message?: string;
  };
  createdAt: string;
};
