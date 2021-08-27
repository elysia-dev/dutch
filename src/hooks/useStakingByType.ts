import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import NetworkType from '../enums/NetworkType';
import StakingType from '../enums/StakingType';
import useStakingPool from './useStakingPool';
import useTxHandler from './useTxHandler';

const useStakingByType = (crytoType: CryptoType) => {
  const { setIsSuccessTx } = useContext(TransactionContext);
  const [resTx, setResTx] = useState<TransactionResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { afterTxHashCreated, afterTxCreated, afterTxFailed } = useTxHandler();
  const stakingPoolContract = useStakingPool(crytoType);
  const navigation = useNavigation();

  const notifyFail = () => {
    navigation.goBack();
    afterTxFailed('Transaction failed');
  };

  const waitTx = async () => {
    try {
      await resTx?.wait();
      setIsSuccessTx(true);
      afterTxCreated(resTx?.hash || '', NetworkType.ETH);
    } catch (error) {
      notifyFail();
      console.log(error);
    }
  };

  const stakeByType = async (
    value: string,
    round: number,
    type: StakingType,
  ) => {
    setIsLoading(true);
    setIsSuccessTx(false);
    try {
      switch (type) {
        case StakingType.Stake:
          setResTx(await stakingPoolContract.stake(utils.parseUnits(value)));
          break;
        case StakingType.Unstake:
          setResTx(
            await stakingPoolContract.withdraw(utils.parseUnits(value), round),
          );
          break;
        case StakingType.Migrate:
          setResTx(
            await stakingPoolContract.migrate(utils.parseUnits(value), round),
          );
          break;
        default:
          setResTx(await stakingPoolContract.claim(round));
          break;
      }
    } catch (error) {
      notifyFail();
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
