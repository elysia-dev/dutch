import { createContext } from 'react';
import { BigNumber } from 'ethers';
import Staking from '../types/Staking';

export type StakingStateType = {
  elStakingList: Staking[];
  elfiStakingList: Staking[];
  elStakingRewards: BigNumber[];
  elfiStakingRewards: BigNumber[];
  stakingLoaded: boolean;
};

interface IStakingContext extends StakingStateType {
  loadStakingInfo: () => Promise<void>;
}

export const initialStakingState = {
  elStakingList: [
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
  ],
  elfiStakingList: [
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
    {
      userIndex: BigNumber.from(0),
      userPrincipal: BigNumber.from(0),
      userReward: BigNumber.from(0),
    },
  ],
  elStakingRewards: [
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
  ],
  elfiStakingRewards: [
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
    BigNumber.from(0),
  ],
  stakingLoaded: false,
};

const initialStakingContext = {
  ...initialStakingState,
  loadStakingInfo: async () => {},
};

const StakingContext = createContext<IStakingContext>(initialStakingContext);

export default StakingContext;
