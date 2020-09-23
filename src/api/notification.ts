import { AxiosResponse } from "axios";
import { authenticatedEspressoClient } from "./axiosInstances";
import NotificationType from "../enums/NotificationType";

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
