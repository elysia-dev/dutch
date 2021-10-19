import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumberish } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import StakingType from '../enums/StakingType';
import TransferType from '../enums/TransferType';
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
  const [gasPrice, setGasPrice] = useState<BigNumberish | undefined>();

  const getCurrentGasPrice = async () => {
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

  const txLastNonce = (lastNonce?: number) => {
    return {
      nonce: lastNonce ? lastNonce + 1 : undefined,
    };
  };

  const stakeByType = async (
    value: string,
    round: number,
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
          res = await stakingPoolContract.stake(
            utils.parseUnits(value),
            txLastNonce(lastNonce),
          );
          break;
        case StakingType.Unstake:
          res = await stakingPoolContract.withdraw(
            utils.parseUnits(value),
            round,
            txLastNonce(lastNonce),
          );
          break;
        case StakingType.Migrate:
          res = await stakingPoolContract.migrate(
            utils.parseUnits(value),
            round,
            txLastNonce(lastNonce),
          );
          break;
        default:
          res = await stakingPoolContract.claim(round, txLastNonce(lastNonce));
          break;
      }
      return res;
    } catch (error) {
      console.log(error);
      throw Error;
    }
  };

  useEffect(() => {
    getCurrentGasPrice();
  }, []);

  return { stakeByType };
};

export default useStakingByType;
