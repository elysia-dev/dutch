import { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { espressoClient, authenticatedEspressoClient } from './axiosInstances';
import { AccountResponse, UserResponse } from '../types/AccountResponse';

export default class Api {
  static sendQuestion = async (content: string): Promise<AxiosResponse> => {
    return (await authenticatedEspressoClient()).post('/questions', {
      content,
    });
  };
}
