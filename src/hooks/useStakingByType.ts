import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumberish } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import StakingType from '../enums/StakingType';
import { provider } from '../utiles/getContract';
import useStakingPool from './useStakingPool';

const useStakingByType = (
  cryptoType: CryptoType,
  setIsLoading: (isBoolean: boolean) => void,
  isElfiV2: boolean,
  type: StakingType,
) => {
  const stakingPoolContract = useStakingPool(cryptoType, isElfiV2);
  const { waitingTxs } = useContext(TransactionContext);
  const [gasPrice, setGasPrice] = useState<BigNumberish>();

  const loadCurrentGasPrice = async () => {
    setGasPrice(
      utils.parseUnits(
        utils.formatUnits(await provider.getGasPrice(), 9),
        'gwei',
      ),
    );
  };

  const getLastNonce = () => {
    const txs = waitingTxs.filter((tx) => {
      return tx.cryptoType !== CryptoType.BNB;
    });
    return txs.length !== 0
      ? waitingTxs[waitingTxs.length - 1].nonce
      : undefined;
  };

  const addLastNonce = (lastNonce?: number) => {
    return lastNonce ? lastNonce + 1 : undefined;
  };

  const stakeByType = async (
    value: string,
    round: number,
    gasLimit: string,
    unstake?: string,
  ) => {
    setIsLoading(true);
    let res: TransactionResponse | undefined;
    let lastNonce: number | undefined;
    if (waitingTxs) {
      lastNonce = getLastNonce();
    }
    try {
      switch (unstake || type) {
        case StakingType.Stake:
          res = await stakingPoolContract.stake(utils.parseUnits(value), {
            nonce: addLastNonce(lastNonce),
            gasPrice,
            gasLimit,
          });
          break;
        case StakingType.Unstake:
          res = await stakingPoolContract.withdraw(
            utils.parseUnits(value),
            round,
            {
              nonce: addLastNonce(lastNonce),
              gasPrice,
              gasLimit,
            },
          );
          break;
        case StakingType.Migrate:
          res = await stakingPoolContract.migrate(
            utils.parseUnits(value),
            round,
            {
              nonce: addLastNonce(lastNonce),
              gasPrice,
              gasLimit,
            },
          );
          break;
        default:
          res = await stakingPoolContract.claim(round, {
            nonce: addLastNonce(lastNonce),
            gasPrice,
            gasLimit,
          });
          break;
      }
      return res;
    } catch (error) {
      console.log(error);
      throw Error;
    }
  };

  useEffect(() => {
    loadCurrentGasPrice();
  }, []);

  return { stakeByType };
};

export default useStakingByType;
