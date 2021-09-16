/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import react, { useEffect, useState } from 'react';
import StakingType from '../enums/StakingType';

const useCountingEstimatedGas = (
  setEstimateGas: (stakingType?: StakingType, round?: number) => Promise<void>,
  stakingType?: StakingType,
) => {
  const [count, setCount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const approveTxSucOrTimeOut = () => {
    setIsApproved(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (count === 0 || count >= 4) return;
    setTimeout(async () => {
      try {
        await setEstimateGas(stakingType);
        approveTxSucOrTimeOut();
      } catch (error) {
        addCount();
      } finally {
        if (count >= 3) {
          approveTxSucOrTimeOut();
        }
      }
    }, 2000);
  }, [count]);

  const addCount = () => {
    setCount((prev) => prev + 1);
  };

  return { addCount, isApproved, setIsApproved, isLoading, setIsLoading };
};

export default useCountingEstimatedGas;
