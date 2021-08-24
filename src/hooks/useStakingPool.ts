import { StakingPool__factory } from '@elysia-dev/contract-typechain';
import { useContext } from 'react';
import {
  ELFI_STAKING_POOL_ADDRESS,
  EL_STAKING_POOL_ADDRESS,
} from 'react-native-dotenv';
import WalletContext from '../contexts/WalletContext';
import CryptoType from '../enums/CryptoType';
import { provider } from '../utiles/getContract';

const useStakingPool = (crytoType: CryptoType) => {
  const { wallet } = useContext(WalletContext);
  const contract = StakingPool__factory.connect(
    crytoType === CryptoType.EL
      ? EL_STAKING_POOL_ADDRESS
      : ELFI_STAKING_POOL_ADDRESS,
    wallet?.getFirstSigner() || provider,
  );

  return contract;
};

export default useStakingPool;
