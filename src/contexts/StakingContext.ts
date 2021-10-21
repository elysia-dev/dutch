import { createContext } from 'react';
import { BigNumber, constants } from 'ethers';
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
  elStakingList: [],
  elfiStakingList: [],
  elStakingRewards: [],
  elfiStakingRewards: [],
  stakingLoaded: false,
};

const initialStakingContext = {
  ...initialStakingState,
  loadStakingInfo: async () => {},
};

const StakingContext = createContext<IStakingContext>(initialStakingContext);

export default StakingContext;
