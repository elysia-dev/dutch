import { BigNumber } from 'ethers';

type Staking = {
  userIndex: BigNumber;
  userReward: BigNumber;
  userPrincipal: BigNumber;
};

export default Staking;
