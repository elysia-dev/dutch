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
  const [successTx, setSuccessTx] = useState<TransactionReceipt>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { afterTxFailed, afterTxHashCreated, afterTxCreated } = useTxHandler();
  const navigation = useNavigation();

  const waitTx = async () => {
    try {
      setSuccessTx(await resTx?.wait());
      afterTxCreated(resTx?.hash || '', NetworkType.ETH);
      setIsLoading(false);
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

  const initStaking = async (
    value: string,
    round: number,
    type: StakingType,
  ) => {
    setIsLoading(true);
    switch (type) {
      case StakingType.Unstake:
        await unStake(value, round);
        break;
      default:
        await stake(value);
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
      navigation.goBack();
      noticeTxStatus();
      waitTx();
    }
  }, [resTx]);

  return { isLoading, initStaking, setIsLoading };
};

export default useStakingByType;
