import { BigNumber, constants, utils } from 'ethers';
import { useContext } from 'react';
import CryptoType from '../enums/CryptoType';
import {
  getElStakingPoolContract,
  getElfiStakingPoolContract,
} from './getContract';
import {
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
} from '../constants/staking';
import PriceContext from '../contexts/PriceContext';

const calcAPR = (cryptoType: CryptoType, round: number): BigNumber => {
  const { getCryptoPrice } = useContext(PriceContext);
  const contract =
    cryptoType === CryptoType.EL
      ? getElStakingPoolContract()
      : getElfiStakingPoolContract();

  let principal = BigNumber.from(0);
  contract?.getPoolData(round).then((res: any) => {
    principal = BigNumber.from(res[4]); // totalPrincipal
  });
  const principalPrice = getCryptoPrice(cryptoType);
  const rewardPerDay = BigNumber.from(
    cryptoType === CryptoType.EL
      ? ELFI_PER_DAY_ON_EL_STAKING_POOL
      : DAI_PER_DAY_ON_ELFI_STAKING_POOL,
  );
  const rewardPrice = getCryptoPrice(
    cryptoType === CryptoType.EL ? CryptoType.ELFI : CryptoType.DAI,
  );

  if (principal.isZero() || principalPrice === 0) {
    return constants.MaxUint256;
  }

  return rewardPerDay
    .mul(365)
    .mul(utils.parseEther(rewardPrice.toFixed(4)))
    .mul(utils.parseUnits('1', 27))
    .div(principal.mul(utils.parseEther(principalPrice.toFixed(4))));
};

export default calcAPR;
