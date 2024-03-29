import moment from 'moment';
import { STAKING_POOL_ROUNDS, NUMBER_OF_ROUNDS } from '../constants/staking';
import StakingStatus from '../enums/StakingStatus';

function getStakingStatus(round: number) {
  const now = moment();
  const firstRoundStartDate = STAKING_POOL_ROUNDS[0].startedAt;
  const lastRoundEndDate = STAKING_POOL_ROUNDS[NUMBER_OF_ROUNDS - 1].endedAt;
  const roundStartDate = STAKING_POOL_ROUNDS[round ? round - 1 : 0].startedAt;
  const roundEndDate = STAKING_POOL_ROUNDS[round ? round - 1 : 0].endedAt;

  if (now.isBefore(firstRoundStartDate)) {
    return StakingStatus.NOT_YET_STARTED;
  } else if (now.isAfter(lastRoundEndDate)) {
    return StakingStatus.ENDED;
  } else if (now.isBetween(roundStartDate, roundEndDate)) {
    return StakingStatus.ROUND_IN_PROGRESS;
  } else {
    return StakingStatus.ROUND_NOT_IN_PROGRESS;
  }
}

export default getStakingStatus;
