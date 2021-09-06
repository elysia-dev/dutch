import { utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import useStakingPool from './useStakingPool';
import UserContext from '../contexts/UserContext';

const useStakingInfo = (crytoType: CryptoType, selectedRound: number) => {
  const [userStakedData, setUserStakedData] = useState<{
    principal: number;
    reward: number;
  }>({
    principal: 0,
    reward: 0,
  });
  const { wallet } = useContext(WalletContext);
  const { user, isWalletUser } = useContext(UserContext);
  const stakingPoolContract = useStakingPool(crytoType);
  const userAddress = isWalletUser
    ? wallet?.getFirstAddress()
    : user.ethAddresses[0];

  useEffect(() => {
    stakingPoolContract
      ?.getUserData(selectedRound, userAddress || '')
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
      .getUserReward(userAddress || '', selectedRound)
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
