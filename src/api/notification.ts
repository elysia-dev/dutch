import { AxiosResponse } from 'axios';
import { NotificationResponse } from '../types/Notification';
import { authenticatedEspressoClient } from './axiosInstances';

export default class Api {
  static notification = async (): Promise<
    AxiosResponse<NotificationResponse[]>
  > => {
    return (await authenticatedEspressoClient()).get(`/notifications`);
  };

  static read = async (
    id: number,
  ): Promise<AxiosResponse<NotificationResponse[]>> => {
    return (await authenticatedEspressoClient()).put(`/notifications/${id}`);
  };
}
