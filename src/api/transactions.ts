import { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { espressoClient, authenticatedEspressoClient } from './axiosInstances';
import { AccountResponse, UserResponse } from '../types/AccountResponse';
import { Transaction } from '../types/Transaction';

export class Api {
  static getTransaction = async (
    id: number,
    page: number,
  ): Promise<AxiosResponse<Transaction[]>> => {
    return (await authenticatedEspressoClient()).get(
      `/transactions?ownershipId=${id}&page=${page}`,
    );
  };
}
