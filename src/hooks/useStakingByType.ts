import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import StakingType from '../enums/StakingType';
import ToastStatus from '../enums/ToastStatus';
import TransferType from '../enums/TransferType';
import useStakingPool from './useStakingPool';

const useStakingByType = (
  cryptoType: CryptoType,
  setIsLoading: (isBoolean: boolean) => void,
  isElfiV2: boolean,
  type: StakingType,
) => {
  const [resTx, setResTx] = useState<TransactionResponse>();
  const stakingPoolContract = useStakingPool(cryptoType, isElfiV2);
  const navigation = useNavigation();
  const { waitingTxs, setWaitingTx, removeStorageTx, setToastList } =
    useContext(TransactionContext);

  const waitTx = async () => {
    try {
      await resTx?.wait();
      setToastList(type, ToastStatus.Success);
      removeStorageTx(resTx?.hash);
    } catch (error) {
      navigation.goBack();
      setToastList(type, ToastStatus.Fail);
    }
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
      // gasPrice: utils.parseUnits('1', 'wei'),
    };
  };

  const stakeByType = async (
    value: string,
    round: number,
    unStakingAmount?: string,
    reward?: number,
  ) => {
    setIsLoading(true);
    let res: TransactionResponse | undefined;
    let lastNonce: number | undefined;
    if (waitingTxs) {
      lastNonce = getLastNonce();
    }
    try {
      switch (type) {
        case StakingType.Stake:
          res = await stakingPoolContract.stake(
            utils.parseUnits(value),
            {
              gasPrice: utils.parseUnits('1', 'gwei'),
            },
            // txLastNonce(lastNonce),
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
          if (unStakingAmount) {
            setWaitingTx(
              TransferType.Unstaking,
              unStakingAmount || '',
              res,
              cryptoType,
            );
          }
          setWaitingTx(
            TransferType.StakingReward,
            reward?.toString() || '',
            res,
            cryptoType,
          );
          break;
        default:
          res = await stakingPoolContract.claim(round, txLastNonce(lastNonce));
          break;
      }
      setResTx(res);
      setToastList(type, ToastStatus.Waiting);
      setWaitingTx(type, value, res, cryptoType);
    } catch (error) {
      console.log(error);
      navigation.goBack();
      setToastList(type, ToastStatus.Fail);
    }
  };

  useEffect(() => {
    if (resTx) {
      setIsLoading(false);
      navigation.goBack();
      waitTx();
    }
  }, [resTx]);

  return { stakeByType };
};

export default useStakingByType;
