import { StakingPool } from '@elysia-dev/contract-typechain';
import { BigNumber, utils } from 'ethers';
import { StringMap } from 'i18next';
import { useContext, useState } from 'react';
import PriceContext from '../contexts/PriceContext';
import StakingType from '../enums/StakingType';

type info = {
  estimagedGasPrice: string;
  setEstimateGas: (
    stakingPoolContract: StakingPool,
    stakingType: StakingType,
    round?: number,
  ) => Promise<void>;
};

const useEstimateGas = (): info => {
  const [estimagedGasPrice, setEstimatedGasPrice] = useState<string>('');
  const { gasPrice } = useContext(PriceContext);

  const setEstimateGas = async (
    stakingPoolContract: StakingPool,
    stakingType: StakingType,
    round?: number,
  ) => {
    setEstimatedGasPrice(
      (await estimateGasByType(stakingPoolContract, stakingType, round)) || '',
    );
  };

  const estimateGasByType = async (
    stakingPoolContract: StakingPool,
    stakingType: string,
    round?: number,
  ) => {
    let estimateGas: BigNumber | undefined;
    try {
      switch (stakingType) {
        case StakingType.Stake:
          estimateGas = await stakingPoolContract?.estimateGas.stake(
            utils.parseEther('100'),
          );
          break;
        case StakingType.Unstake:
          estimateGas = await stakingPoolContract?.estimateGas.withdraw(
            utils.parseEther('100'),
            round || '',
          );
          break;
        case StakingType.Reward:
          estimateGas = await stakingPoolContract?.estimateGas.claim(
            round || '',
          );
          break;
        default:
          estimateGas = await stakingPoolContract?.estimateGas.migrate(
            utils.parseEther('100'),
            round || '',
          );
          break;
      }

      return utils.formatEther(estimateGas.mul(gasPrice));
    } catch (error) {
      console.log(error);
      return '';
    }
  };

  return { estimagedGasPrice, setEstimateGas };
};

export default useEstimateGas;
