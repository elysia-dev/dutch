import { createContext } from 'react';
import { BigNumber } from 'ethers';
import Staking from '../types/Staking';

export type StakingStateType = {
  elStakingList: Staking[];
  elfiStakingList: Staking[];
  elStakingRewards: BigNumber[];
  elfiStakingRewards: BigNumber[];
  // 앗 stakingLoaded도 만들어야 할 듯..!!
};

interface IStakingContext extends StakingStateType {}

export const initialStakingState = {
  elStakingList: [] as Staking[],
  elfiStakingList: [] as Staking[],
  elStakingRewards: [] as BigNumber[],
  elfiStakingRewards: [] as BigNumber[],
};

const initialStakingContext = {
  ...initialStakingState,
};

const StakingContext = createContext<IStakingContext>(initialStakingContext);

export default StakingContext;
