import moment from 'moment';
import { STAKING_POOL_ROUNDS_MOMENT } from '../constants/staking';
import RoundStatus from '../enums/RoundStatus';

function getRoundStatus(round: number) {
  const now = moment();
  const roundStartDate = STAKING_POOL_ROUNDS_MOMENT[round - 1].startedAt;
  const roundEndDate = STAKING_POOL_ROUNDS_MOMENT[round - 1].endedAt;

  if (now.isBefore(roundStartDate)) {
    return RoundStatus.SCHEDULED;
  } else if (now.isBetween(roundStartDate, roundEndDate)) {
    return RoundStatus.IN_PROGRESS;
  } else {
    return RoundStatus.ENDED;
  }
}

export default getRoundStatus;
