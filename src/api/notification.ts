import { AxiosResponse } from "axios";
import { authenticatedEspressoClient } from "./axiosInstances";
import Notification from '../types/Notification';

export default class Api {
  static notification = async (): Promise<
    AxiosResponse<Notification[]>
  > => {
    return (await authenticatedEspressoClient()).get(`/notifications`);
  };

  static read = async (
    id: number,
  ): Promise<AxiosResponse<void>> => {
    return (await authenticatedEspressoClient()).put(`/notifications/${id}`);
  };
}
