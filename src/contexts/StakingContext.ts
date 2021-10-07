import { createContext } from 'react';
import { BigNumber } from 'ethers';
import Staking from '../types/Staking';

export type StakingStateType = {
  stakingList: Staking[];
  stakingRewards: BigNumber[];
};

interface IStakingContext extends StakingStateType {
  // loadV2UserBalances: (cacheControl?: boolean) => Promise<void>;
  // loadV1UserBalances: (cacheControl?: boolean) => Promise<void>;
  // getBalance: (unit: string) => number;
  // refreshBalance: (cryptoType: CryptoType) => Promise<void>;
}

export const initialStakingState = {
  // stakingList: [
  //   {
  //     userIndex: BigNumber.from(0),
  //     userReward: BigNumber.from(0),
  //     userPrincipal: BigNumber.from(0),
  //   },
  // ],
  // stakingRewards: [BigNumber.from(0)],
  stakingList: [] as Staking[],
  stakingRewards: [] as BigNumber[],
};

const initialStakingContext = {
  ...initialStakingState,
  // loadV2UserBalances: async () => {},
  // loadV1UserBalances: async () => {},
  // getBalance: () => {
  //   return 0;
  // },
  // refreshBalance: async (_cryptoType: CryptoType) => {},
};

const StakingContext = createContext<IStakingContext>(initialStakingContext);

export default StakingContext;
