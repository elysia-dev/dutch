import React, { useEffect, useState } from 'react';
import StakingType from '../enums/StakingType';

const useCount = (
  setEstimateGas: (stakingType?: StakingType, round?: number) => Promise<void>,
  setIsApproved: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  stakingType?: StakingType,
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count === 0 || count >= 4) return;
    setTimeout(async () => {
      try {
        await setEstimateGas(stakingType);
        setIsApproved(true);
        setIsLoading(false);
      } catch (error) {
        setAddCount();
      } finally {
        if (count >= 3) {
          setIsApproved(true);
          setIsLoading(false);
        }
      }
    }, 2000);
  }, [count]);

  const setAddCount = () => {
    setCount((prev) => prev + 1);
  };

  return { setAddCount };
};

export default useCount;
