import { utils } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import TransactionContext from '../contexts/TransactionContext';
import CryptoType from '../enums/CryptoType';
import NetworkType from '../enums/NetworkType';
import StakingType from '../enums/StakingType';
import TransferType from '../enums/TransferType';
import useStakingPool from './useStakingPool';
import useTxHandler from './useTxHandler';
import useWaitTx from './useWaitTx';

const useStakingByType = (
  cryptoType: CryptoType,
  setIsLoading: (isBoolean: boolean) => void,
  isElfiV2: boolean,
) => {
  const { setIsSuccessTx } = useContext(TransactionContext);
  const [resTx, setResTx] = useState<TransactionResponse>();
  const { afterTxHashCreated, afterTxCreated, afterTxFailed } = useTxHandler();
  const stakingPoolContract = useStakingPool(cryptoType, isElfiV2);
  const navigation = useNavigation();
  const { waitingTxs, setWaitingTx, removeStorageTx } = useWaitTx(cryptoType);

  const notifyFail = () => {
    navigation.goBack();
    afterTxFailed('Transaction failed');
  };

  const waitTx = async () => {
    try {
      await resTx?.wait();
      removeStorageTx(resTx?.hash);
      setIsSuccessTx(true);
      afterTxCreated(resTx?.hash || '', NetworkType.ETH);
    } catch (error) {
      throw Error;
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
    };
  };

  const stakeByType = async (
    value: string,
    round: number,
    type: StakingType | TransferType,
    unStakingAmount?: string,
    reward?: number,
  ) => {
    setIsLoading(true);
    setIsSuccessTx(false);
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
            txLastNonce(lastNonce),
          );
          setResTx(res);
          break;
        case StakingType.Unstake:
          res = await stakingPoolContract.withdraw(
            utils.parseUnits(value),
            round,
            txLastNonce(lastNonce),
          );
          setResTx(res);
          break;
        case StakingType.Migrate:
          res = await stakingPoolContract.migrate(
            utils.parseUnits(value),
            round,
            txLastNonce(lastNonce),
          );
          setResTx(res);
          if (unStakingAmount) {
            setWaitingTx(TransferType.Unstaking, unStakingAmount || '', res);
          }
          setWaitingTx(
            TransferType.StakingReward,
            reward?.toString() || '',
            res,
          );
          break;
        default:
          res = await stakingPoolContract.claim(round, txLastNonce(lastNonce));
          setResTx(res);
          break;
      }
      setWaitingTx(type, value, res);
    } catch (error) {
      console.log(error);
      throw Error;
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

  return { stakeByType };
};

export default useStakingByType;
