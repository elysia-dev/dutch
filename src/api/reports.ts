import { AxiosResponse } from 'axios';
import { espressoClient, authenticatedEspressoClient } from './axiosInstances';
import { SummaryReport } from '../types/SummaryReport';

export class Api {
  static getSummaryReport = async (): Promise<AxiosResponse<SummaryReport>> => {
    return (await authenticatedEspressoClient()).get('/reports/summary');
  };
}
