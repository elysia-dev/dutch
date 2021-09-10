import { BigNumber, utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import PriceContext from '../contexts/PriceContext';
import CryptoType from '../enums/CryptoType';
import StakingType from '../enums/StakingType';
import useStakingPool from './useStakingPool';

type info = {
  estimagedGasPrice: string;
  setEstimatedGas: (stakingType?: StakingType, round?: number) => Promise<void>;
};

const useStakeEstimatedGas = (
  crytoType: CryptoType,
  stakingType: StakingType,
  round?: number,
): info => {
  const [estimagedGasPrice, setEstimatedGasPrice] = useState<string>('');
  const { gasPrice } = useContext(PriceContext);
  const stakingPoolContract = useStakingPool(crytoType);

  const setEstimatedGas = async (stakingType?: StakingType, round?: number) => {
    setEstimatedGasPrice(
      (await estimateGasByType(stakingType || '', round)) || '',
    );
  };

  const estimateGasByType = async (stakingType: string, round?: number) => {
    let estimateGas: BigNumber | undefined;
    try {
      switch (stakingType) {
        case StakingType.Stake:
          estimateGas = await stakingPoolContract?.estimateGas.stake(
            utils.parseEther('1'),
          );
          break;
        case StakingType.Unstake:
          estimateGas = await stakingPoolContract?.estimateGas.withdraw(
            utils.parseEther('1'),
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
            utils.parseEther('1'),
            round || '',
          );
          break;
      }

      return utils.formatEther(estimateGas.mul(gasPrice));
    } catch (error) {
      throw Error;
      return '';
    }
  };

  useEffect(() => {
    setEstimatedGas(stakingType, round);
  }, []);

  return { estimagedGasPrice, setEstimatedGas };
};

export default useStakeEstimatedGas;
