import { createContext } from 'react';
import Notification from '../types/Notification';

const NotificationContext = createContext({
  notifications: [] as Notification[],
  unreadNotificationCount: 0,
  setUnreadNotificationCount: (value: number) => { },
  setNotifications: (notifications: Notification[]) => { },
});

export default NotificationContext;
