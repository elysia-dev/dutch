import { StakingPool } from '@elysia-dev/contract-typechain';
import {
  Transaction,
  utils,
} from '@elysia-dev/contract-typechain/node_modules/ethers';
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import { useNavigation } from '@react-navigation/native';
import { ContractTransaction } from 'ethers';
import { id } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import NetworkType from '../enums/NetworkType';
import StakingType from '../enums/StakingType';
import useTxHandler from './useTxHandler';

const useStakingByType = (stakingPoolContract: StakingPool) => {
  const [resTx, setResTx] = useState<TransactionResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { afterTxHashCreated, afterTxCreated } = useTxHandler();
  const navigation = useNavigation();

  const waitTx = async () => {
    try {
      await resTx?.wait();
      afterTxCreated(resTx?.hash || '', NetworkType.ETH);
    } catch (error) {
      console.log(error);
    }
  };

  const unStake = async (value: string, round: number) => {
    try {
      setResTx(
        await stakingPoolContract.withdraw(utils.parseUnits(value), round),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const stake = async (value: string) => {
    try {
      setResTx(await stakingPoolContract.stake(utils.parseUnits(value)));
    } catch (error) {
      console.error(error);
    }
  };

  const migrate = async (value: string, round: number) => {
    try {
      setResTx(
        await stakingPoolContract.migrate(utils.parseUnits(value), round),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const claim = async (round: number) => {
    try {
      setResTx(await stakingPoolContract.claim(round));
    } catch (error) {
      console.log(error);
    }
  };

  const stakeByType = async (
    value: string,
    round: number,
    type: StakingType,
  ) => {
    setIsLoading(true);
    switch (type) {
      case StakingType.Stake:
        await stake(value);
        break;
      case StakingType.Unstake:
        await unStake(value, round);
        break;
      case StakingType.Migrate:
        await migrate(value, round);
        break;
      default:
        await claim(round);
        break;
    }
  };

  const noticeTxStatus = () => {
    afterTxHashCreated(
      resTx?.from || '',
      resTx?.to || '',
      resTx?.hash || '',
      NetworkType.ETH,
    );
  };

  useEffect(() => {
    if (resTx) {
      setIsLoading(false);
      navigation.goBack();
      noticeTxStatus();
      waitTx();
    }
  }, [resTx]);

  return { isLoading, stakeByType, setIsLoading };
};

export default useStakingByType;
