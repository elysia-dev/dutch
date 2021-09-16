import moment from 'moment';
import 'moment-timezone';

export const NUMBER_OF_ROUNDS = 4;

export const ROUND_DURATIONS = [20, 20, 40, 40]; // 주의: 중간에 변경된 거라 currentRound가 0일 때는 고려하지 않았음

export const ELFI_PER_DAY_ON_EL_STAKING_POOL = 25000;
export const DAI_PER_DAY_ON_ELFI_STAKING_POOL = 1250;

const inputFormat = 'YYYY.MM.DD HH:mm:ss Z';
const timezone = 'Asia/Seoul';

export const STAKING_POOL_ROUNDS = [
  {
    startedAt: moment('2021.07.27 19:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.08.16 19:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.08.26 19:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.09.15 19:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.09.25 19:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.11.04 18:45:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.11.04 19:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.12.14 18:45:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
];
