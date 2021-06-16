import axios, { AxiosResponse } from 'axios';
import CryptoTxsResponse from '../types/CryptoTxsResponse';
import Notification from '../types/Notification';
import Product from '../types/Product';
import WalletBalanceResponse from '../types/WalletBalanceResponse';
import { API_URL } from 'react-native-dotenv';

const baseURL = API_URL;

export default class TransactionsAPIs {
  static getEthTransaction = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `https://api-kovan.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=10&sort=desc&apikey=ASRYBDYSYS98VSJ2VMN65MXU2YWW982ABW`,
    );
  };

  static getErc20Transaction = async (
    address: string,
    tokenAddress: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x2781246fe707bb15cee3e5ea354e2154a2877b16&address=0x85D268A0EBFdeA4F2906C45f402C4C5950767a03&page=${page}&offset=10&sort=desc&apikey=ASRYBDYSYS98VSJ2VMN65MXU2YWW982ABW`,
    );
  };

  static getBnbTransaction = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResponse>> => {
    return axios.get(
      `https://api.bscscan.com/api?module=account&action=txlist&address=0x85D268A0EBFdeA4F2906C45f402C4C5950767a03&startblock=1&endblock=99999999&page=1&offset=10&sort=desc&apikey=U63E7QAMMBVJW2C77C45F2IE8X21PN5A4G`,
    );
  };
}
