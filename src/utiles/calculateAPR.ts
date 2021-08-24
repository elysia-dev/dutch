import { BigNumber, constants, utils } from 'ethers';
import { useContext } from 'react';
import CryptoType from '../enums/CryptoType';
import {
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
} from '../constants/staking';
import PriceContext from '../contexts/PriceContext';
import decimalFormatter from './decimalFormatter';
import commaFormatter from './commaFormatter';
import useStakingPool from '../hooks/useStakingPool';

const calculateAPR = (
  cryptoType: CryptoType,
  principal: BigNumber,
): BigNumber => {
  const { getCryptoPrice } = useContext(PriceContext);

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

export default calculateAPR;

export function aprFormatter(apr: BigNumber) {
  const formattedAPR = commaFormatter(
    decimalFormatter(parseFloat(utils.formatUnits(apr, 25)), 5),
  );
  if (apr === constants.MaxUint256 || formattedAPR.length > 20) {
    return '∞';
  } else {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(parseFloat(utils.formatUnits(apr, 25)));
  }
}
