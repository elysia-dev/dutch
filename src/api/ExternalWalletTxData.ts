import axios, { AxiosResponse } from 'axios';
import { EXTERNAL_WALLET_TX_URL } from 'react-native-dotenv';
import { WaitingTransaction } from '../types/WaitingTransaction';

const baseUrl = EXTERNAL_WALLET_TX_URL;

class ExternalWalletTxData {
  static getTxData = async (
    uuid: string,
  ): Promise<AxiosResponse<WaitingTransaction>> => {
    return await axios.get(`${baseUrl}/${uuid}/tx`);
  };

  static getUuid = async (): Promise<AxiosResponse<any>> => {
    return await axios.post(baseUrl);
  };
}

export default ExternalWalletTxData;
