import NotificationStatus from '../enums/NotificationStatus';
import NotificationType from '../enums/NotificationType';
import NotificationData from './NotificationData';

type Notification = {
  id: number;
  userId: number;
  notificationType: NotificationType;
  status: NotificationStatus;
  data: NotificationData;
  createdAt: Date;
};

export function isNotification(
  notification: Notification,
): notification is Notification {
  return (notification as Notification).notificationType !== undefined;
}

export default Notification;
