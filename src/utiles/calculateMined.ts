import moment from 'moment';
import CryptoType from '../enums/CryptoType';
import {
  STAKING_POOL_ROUNDS,
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
  ELFI_PER_ROUND_ON_EL_STAKING_POOL,
  DAI_PER_ROUND_ON_ELFI_STAKING_POOL,
} from '../constants/staking';

const calculateMined = (
  cryptoType: CryptoType,
  round: number,
  currentRound: number,
): number => {
  // getDotStatus랑 비슷하군..
  const roundStartDate = STAKING_POOL_ROUNDS[round - 1].startedAt;
  const roundEndDate = STAKING_POOL_ROUNDS[round - 1].endedAt;
  const minedPerDay =
    cryptoType === CryptoType.EL
      ? ELFI_PER_DAY_ON_EL_STAKING_POOL
      : DAI_PER_DAY_ON_ELFI_STAKING_POOL;
  const minedPerRound =
    cryptoType === CryptoType.EL
      ? ELFI_PER_ROUND_ON_EL_STAKING_POOL
      : DAI_PER_ROUND_ON_ELFI_STAKING_POOL;

  if (currentRound && moment().isAfter(roundEndDate)) {
    return minedPerRound;
  } else if (
    currentRound &&
    round === currentRound &&
    moment().isBetween(roundStartDate, roundEndDate)
  ) {
    return (
      moment().diff(roundStartDate, 'seconds') * (minedPerDay / (3600 * 24))
    );
  } else {
    return 0;
  }
};

export default calculateMined;
