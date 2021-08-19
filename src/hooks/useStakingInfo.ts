import { StakingPool } from '@elysia-dev/contract-typechain';
import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useStakingInfo = (
  stakingPoolContract: StakingPool,
  selectedRound: number,
  address: string,
) => {
  const [principal, setPrincipal] = useState<number>(0);
  const [reward, setReward] = useState<number>(0);

  useEffect(() => {
    stakingPoolContract
      ?.getUserData(selectedRound, address)
      .then((res: any) => {
        setPrincipal(Number(utils.formatEther(res[2]))); // userPrincipal
        setReward(Number(utils.formatEther(res[1]))); // userReward
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return { principal, reward };
};

export default useStakingInfo;
