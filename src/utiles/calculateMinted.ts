import moment from 'moment';
import CryptoType from '../enums/CryptoType';
import {
  STAKING_POOL_ROUNDS_MOMENT,
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
  ELFI_PER_ROUND_ON_EL_STAKING_POOL,
  DAI_PER_ROUND_ON_ELFI_STAKING_POOL,
} from '../constants/staking';

const calculateMinted = (
  cryptoType: CryptoType,
  round: number,
  currentRound: number,
): number => {
  // getDotStatus랑 비슷하군..
  const roundStartDate = STAKING_POOL_ROUNDS_MOMENT[round - 1].startedAt;
  const roundEndDate = STAKING_POOL_ROUNDS_MOMENT[round - 1].endedAt;
  const mintedPerDay =
    cryptoType === CryptoType.EL
      ? ELFI_PER_DAY_ON_EL_STAKING_POOL
      : DAI_PER_DAY_ON_ELFI_STAKING_POOL;
  const mintedPerRound =
    cryptoType === CryptoType.EL
      ? ELFI_PER_ROUND_ON_EL_STAKING_POOL
      : DAI_PER_ROUND_ON_ELFI_STAKING_POOL;

  if (currentRound && round < currentRound) {
    return mintedPerRound;
  } else if (
    currentRound &&
    round === currentRound &&
    moment().isBetween(roundStartDate, roundEndDate)
  ) {
    return (
      moment().diff(roundStartDate, 'seconds') * (mintedPerDay / (3600 * 24))
    );
  } else {
    return 0;
  }
};

export default calculateMinted;
