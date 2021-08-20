import moment from 'moment';
import { STAKING_POOL_ROUNDS_MOMENT } from '../constants/staking';
import StakingStatus from '../enums/StakingStatus';

function getStakingStatus(round: number) {
  const now = moment();
  const firstRoundStartDate = STAKING_POOL_ROUNDS_MOMENT[0].startedAt;
  const lastRoundEndDate = STAKING_POOL_ROUNDS_MOMENT[5].endedAt;
  const roundStartDate = STAKING_POOL_ROUNDS_MOMENT[round - 1].startedAt;
  const roundEndDate = STAKING_POOL_ROUNDS_MOMENT[round - 1].endedAt;

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
