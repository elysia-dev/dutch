import axios, { AxiosResponse } from 'axios';

interface IELFIPrice {
  data: {
    token: {
      tokenDayData: { priceUSD: string }[];
    };
  };
}

interface IPoolData {
  data: {
    pool: {
      totalValueLockedUSD: string;
      token0: {
        tokenDayData: {
          priceUSD: string;
          date: number;
        }[];
      };
    };
  };
}

const baseUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

class UniswapClient {
  static getELFIPRice = async (): Promise<AxiosResponse<IELFIPrice>> => {
    return axios.post(baseUrl, {
      query:
        '{ token(id: "0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4"){ tokenDayData(orderBy: date, orderDirection: desc, first:1){ priceUSD } } }',
    });
  };

  static getPoolData = async (): Promise<AxiosResponse<IPoolData>> => {
    return axios.post(baseUrl, {
      query: `
          {
            pool(id: "0xbde484db131bd2ae80e44a57f865c1dfebb7e31f"){
              totalValueLockedUSD,
              token0 {
                tokenDayData(orderBy: date) {
                   date,
                   priceUSD
                  }
                }
              }
          }
        `,
    });
  };
}

export default UniswapClient;
