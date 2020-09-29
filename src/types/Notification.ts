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

export default Notification;
