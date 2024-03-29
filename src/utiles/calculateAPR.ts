import { BigNumber, constants, utils } from 'ethers';
import { useContext } from 'react';
import CryptoType from '../enums/CryptoType';
import {
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
} from '../constants/staking';
import PriceContext from '../contexts/PriceContext';
import decimalFormatter from './decimalFormatter';

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

function bigNumberDivisionFormatter(
  dividend: number,
  divisor: number,
  decimalPlace: number,
) {
  return {
    quotient: parseInt(String(dividend / divisor), 10),
    remainder: (dividend % divisor).toString().substring(0, decimalPlace),
  };
}

export function aprFormatter(apr: BigNumber) {
  const aprResult =
    parseFloat(utils.formatUnits(apr, 25)) * Number('1' + '0'.repeat(18));
  const aprIntegerLength = aprResult.toString().split('.')[0].length;

  if (aprIntegerLength > 15 || apr.eq(constants.MaxUint256)) {
    return '∞';
  } else if (aprIntegerLength > 12) {
    const { quotient, remainder } = bigNumberDivisionFormatter(
      aprResult,
      1000000000000,
      2,
    );
    return `${quotient}.${remainder}T`;
  } else if (aprIntegerLength > 9) {
    const { quotient, remainder } = bigNumberDivisionFormatter(
      aprResult,
      1000000000,
      2,
    );
    return `${quotient}.${remainder}B`;
  } else if (aprIntegerLength > 6) {
    const { quotient, remainder } = bigNumberDivisionFormatter(
      aprResult,
      1000000,
      2,
    );
    return `${quotient}.${remainder}M`;
  } else if (aprIntegerLength > 3) {
    const { quotient, remainder } = bigNumberDivisionFormatter(
      aprResult,
      1000,
      2,
    );
    return `${quotient}.${remainder}K`;
  } else {
    return decimalFormatter(aprResult, 2);
  }
}
