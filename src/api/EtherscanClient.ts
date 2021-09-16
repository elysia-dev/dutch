import axios, { AxiosResponse } from 'axios';
import { setupCache } from 'axios-cache-adapter';
import {
  EL_ADDRESS,
  ETHERSCAN_API,
  APP_ENV,
  BSCSCAN_API,
  ETHERSCAN_API_URL,
  BSCSCAN_API_URL,
} from 'react-native-dotenv';
import CryptoTxsResponse, {
  CryptoTxsResultResponse,
} from '../types/CryptoTxsResponse';

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

const api = axios.create({
  adapter: cache.adapter,
});
export default class EthersacnClient {
  /**
   * 10개씩 ETH 트랜잭션 조회
   */
  static getEthTransaction = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    return await api.get(
      `${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=1000&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };

  /**
   * 10개씩 ERC20 트랜잭션 조회
   */
  static getErc20Transaction = async (
    address: string,
    erc20Address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    return await api.get(
      `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${erc20Address}&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=1000&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };

  /**
   * 10개씩 BNB 트랜잭션 조회
   */
  static getBnbTransaction = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    return await api.get(
      `${BSCSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&page=${page}&offset=1000&sort=desc&apikey=${BSCSCAN_API}`,
    );
  };

  /**
   * 최근 7일, 14일, 30일 ETH 트랜잭션 조회
   */
  static getEthTransactionLatest = async (
    address: string,
    startBlockNumber: number,
    endBlockNumber: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    if (APP_ENV !== 'development') {
      return axios.get(
        `${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${endBlockNumber}&sort=desc&apikey=${ETHERSCAN_API}`,
      );
    }
    return axios.get(
      `${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${endBlockNumber}&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };

  /**
   * 최근 7일, 14일, 30일 ERC20 트랜잭션 조회
   */
  static getErc20TransactionLatest = async (
    address: string,
    startBlockNumber: number,
    endBlockNumber: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    if (APP_ENV !== 'development') {
      return axios.get(
        `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${EL_ADDRESS}&address=${address}&startblock=${startBlockNumber}&endblock=${endBlockNumber}&sort=desc&apikey=${ETHERSCAN_API}`,
      );
    }
    return axios.get(
      `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${EL_ADDRESS}&address=${address}&startblock=${startBlockNumber}&endblock=${endBlockNumber}&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };

  /**
   * 최근 7일, 14일, 30일 BNB 트랜잭션 조회
   */
  static getBnbTransactionLatest = (
    address: string,
    startBlockNumber: number,
    endBlockNumber: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    if (APP_ENV !== 'development') {
      return axios.get(
        `${BSCSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${endBlockNumber}&sort=desc&apikey=${BSCSCAN_API}`,
      );
    }
    return axios.get(
      `${BSCSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${endBlockNumber}&sort=desc&apikey=${BSCSCAN_API}`,
    );
  };

  /**
   * BNB로 구매한 상품 트랜잭션 리스트 조회
   */
  static getBscErc20Transaction = async (
    address: string,
    tokenAddress: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    return axios.get(
      `${BSCSCAN_API_URL}?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${address}&page=${page}&offset=10&sort=desc&apikey=${BSCSCAN_API}`,
    );
  };

  static getAssetErc20Transaction = async (
    address: string,
    tokenAddress: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    return axios.get(
      `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${address}&page=${page}&offset=10&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };

  static getInternalBnbTx = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    return axios.get(
      `${BSCSCAN_API_URL}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=1000&sort=desc&apikey=${BSCSCAN_API}`,
    );
  };

  static getInternalEthTx = async (
    address: string,
    page: number,
  ): Promise<AxiosResponse<CryptoTxsResultResponse>> => {
    return axios.get(
      `${ETHERSCAN_API_URL}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=1000&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };
}
