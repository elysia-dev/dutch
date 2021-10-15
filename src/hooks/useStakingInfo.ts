import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import CryptoType from '../enums/CryptoType';
import useStakingPool from './useStakingPool';
import useUserAddress from './useUserAddress';

const useStakingInfo = (
  crytoType: CryptoType,
  selectedRound: number,
  isElfiV2: boolean,
) => {
  const [userStakedData, setUserStakedData] = useState<{
    principal: number;
    reward: number;
  }>({
    principal: 0,
    reward: 0,
  });
  const stakingPoolContract = useStakingPool(crytoType, isElfiV2);
  const userAddress = useUserAddress();

  useEffect(() => {
    stakingPoolContract
      ?.getUserData(selectedRound, userAddress)
      .then((res: any) => {
        setUserStakedData({
          ...userStakedData,
          principal: Number(utils.formatEther(res[2])),
        });
      })
      .catch((e) => {
        console.log(e);
      });
    stakingPoolContract
      .getUserReward(userAddress, selectedRound)
      .then((res) => {
        setUserStakedData({
          ...userStakedData,
          reward: Number(utils.formatEther(res)),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return userStakedData;
};

export default useStakingInfo;
