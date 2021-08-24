import { utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import useStakingPool from './useStakingPool';

const useStakingInfo = (crytoType: CryptoType, selectedRound: number) => {
  const [userStakedData, setUserStakedData] = useState<{
    principal: number;
    reward: number;
  }>({
    principal: 0,
    reward: 0,
  });
  const { wallet } = useContext(WalletContext);
  const stakingPoolContract = useStakingPool(crytoType);

  useEffect(() => {
    stakingPoolContract
      ?.getUserData(selectedRound, wallet?.getFirstAddress() || '')
      .then((res: any) => {
        setUserStakedData({
          principal: Number(utils.formatEther(res[2])),
          reward: Number(utils.formatEther(res[1])),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return userStakedData;
};

export default useStakingInfo;
