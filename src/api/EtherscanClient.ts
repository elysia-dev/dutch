import axios, { AxiosResponse } from 'axios';
import {
  EL_ADDRESS,
  ETHERSCAN_API,
  APP_ENV,
  BSCSCAN_API,
  ETHERSCAN_API_URL,
  BSCSCAN_API_URL,
} from 'react-native-dotenv';

export default class EthersacnClient {
  /**
   * 10개씩 ETH 트랜잭션 조회
   */
  static getEthTransaction = async (
    address: string,
    lastBlock: number,
  ): Promise<AxiosResponse> => {
    if (APP_ENV !== 'development') {
      return await axios.get(
        `${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=${lastBlock}&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API}`,
      );
    }
    return await axios.get(
      `${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=${lastBlock}&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };

  /**
   * 10개씩 ERC20 트랜잭션 조회
   */
  static getErc20Transaction = async (
    address: string,
    lastBlock: number,
  ): Promise<AxiosResponse> => {
    if (APP_ENV !== 'development') {
      return await axios.get(
        `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${EL_ADDRESS}&address=${address}&startblock=0&endblock=${lastBlock}&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API}`,
      );
    }
    return await axios.get(
      `${ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${EL_ADDRESS}&address=${address}&startblock=0&endblock=${lastBlock}&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API}`,
    );
  };

  /**
   * 10개씩 BNB 트랜잭션 조회
   */
  static getBnbTransaction = async (
    address: string,
    lastBlock: number,
  ): Promise<AxiosResponse> => {
    if (APP_ENV !== 'development') {
      return await axios.get(
        `${BSCSCAN_API_URL}? module=account&action=txlist&address=${address}&startblock=1&endblock=${lastBlock}&page=1&offset=10&sort=desc&apikey=${BSCSCAN_API}`,
      );
    }
    return await axios.get(
      `${BSCSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=1&endblock=${lastBlock}&page=1&offset=10&sort=desc&apikey=${BSCSCAN_API}`,
    );
  };

  /**
   * 최근 7일, 14일, 30일 ETH 트랜잭션 조회
   */
  static getEthTransactionLatest = async (
    address: string,
    startBlockNumber: number,
    endBlockNumber: number,
  ): Promise<AxiosResponse> => {
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
  ): Promise<AxiosResponse> => {
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
  ): Promise<AxiosResponse> => {
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
   * BNB 가장 최근에 생성된 블록넘버 조회
   */
  static getBnbLatestBlock = async (): Promise<AxiosResponse> => {
    const date = (new Date().getTime() / 1000).toFixed(0);
    if (APP_ENV !== 'development') {
      return axios.get(
        `${BSCSCAN_API_URL}?module=block&action=getblocknobytime&timestamp=${date}&closest=before&apikey=${BSCSCAN_API}`,
      );
    }
    return axios.get(
      `${BSCSCAN_API_URL}?module=block&action=getblocknobytime&timestamp=${date}&closest=before&apikey=${BSCSCAN_API}`,
    );
  };
}
