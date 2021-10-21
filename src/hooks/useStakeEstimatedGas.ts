import { BigNumber, utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import PriceContext from '../contexts/PriceContext';
import CryptoType from '../enums/CryptoType';
import StakingType from '../enums/StakingType';
import useStakingPool from './useStakingPool';

type info = {
  estimagedGasPrice: string;
  setEstimatedGas: (
    stakingType?: StakingType,
    round?: number,
    value?: string,
  ) => Promise<void>;
  gasLimit: string;
};

const useStakeEstimatedGas = (
  crytoType: CryptoType,
  stakingType: StakingType,
  isElfiV2: boolean,
  round?: number,
): info => {
  const [estimagedGasPrice, setEstimatedGasPrice] = useState<string>('');
  const [gasLimit, setGasLimit] = useState<string>('');
  const { gasPrice } = useContext(PriceContext);
  const stakingPoolContract = useStakingPool(crytoType, isElfiV2);

  const setEstimatedGas = async (
    stakingType?: StakingType,
    round?: number,
    value?: string,
  ) => {
    setEstimatedGasPrice(
      (await estimateGasByType(stakingType!, round, value))!,
    );
  };

  const estimateGasByType = async (
    stakingType: string,
    round?: number,
    value?: string,
  ) => {
    let estimateGas: BigNumber | undefined;
    try {
      switch (stakingType) {
        case StakingType.Stake:
          estimateGas = await stakingPoolContract?.estimateGas.stake(
            utils.parseEther(value || '0.0001'),
          );
          break;
        case StakingType.Unstake:
          estimateGas = await stakingPoolContract?.estimateGas.withdraw(
            utils.parseUnits(value || '0.0001'),
            round!,
          );
          break;
        case StakingType.Reward:
          estimateGas = await stakingPoolContract?.estimateGas.claim(round!);
          break;
        default:
          estimateGas = await stakingPoolContract?.estimateGas.migrate(
            utils.parseEther(value || '0.0001'),
            round!,
          );
          break;
      }
      setGasLimit(utils.formatUnits(estimateGas, 0));
      return utils.formatEther(estimateGas.mul(gasPrice));
    } catch (error) {
      throw Error;
    }
  };

  useEffect(() => {
    setEstimatedGas(stakingType, round);
  }, []);

  return { estimagedGasPrice, setEstimatedGas, gasLimit };
};

export default useStakeEstimatedGas;
