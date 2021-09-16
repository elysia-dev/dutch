import moment from 'moment';
import { STAKING_POOL_ROUNDS, NUMBER_OF_ROUNDS } from '../constants/staking';

function getCurrentStakingRound() {
  const now = moment();

  if (now.isAfter(STAKING_POOL_ROUNDS[NUMBER_OF_ROUNDS - 1].startedAt)) {
    return NUMBER_OF_ROUNDS;
  }

  for (let i = 0; i < STAKING_POOL_ROUNDS.length; i++) {
    if (
      now.isBetween(
        STAKING_POOL_ROUNDS[i].startedAt,
        STAKING_POOL_ROUNDS[i + 1].startedAt,
      )
    ) {
      return i + 1;
    }
  }
  return 0;
}

export default getCurrentStakingRound;
