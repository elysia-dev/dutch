import moment from 'moment';
import 'moment-timezone';

export const ROUND_DURATION = 20;
export const NUMBER_OF_ROUNDS = 6;

export const ELFI_PER_DAY_ON_EL_STAKING_POOL = 25000;
export const DAI_PER_DAY_ON_ELFI_STAKING_POOL = 1250;

export const ELFI_PER_ROUND_ON_EL_STAKING_POOL =
  ELFI_PER_DAY_ON_EL_STAKING_POOL * ROUND_DURATION;
export const DAI_PER_ROUND_ON_ELFI_STAKING_POOL =
  DAI_PER_DAY_ON_ELFI_STAKING_POOL * ROUND_DURATION;

export const TOTAL_AMOUNT_OF_ELFI_ON_EL_STAKING_POOL =
  ELFI_PER_ROUND_ON_EL_STAKING_POOL * NUMBER_OF_ROUNDS;
export const TOTAL_AMOUNT_OF_DAI_ON_ELFI_STAKING_POOL =
  DAI_PER_ROUND_ON_ELFI_STAKING_POOL * NUMBER_OF_ROUNDS;

const inputFormat = 'YYYY.MM.DD hh:mm:ss Z';
const timezone = 'Asia/Seoul';

export const STAKING_POOL_ROUNDS = [
  {
    startedAt: moment('2021.08.20 09:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.08.21 09:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.08.23 02:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.08.24 02:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.08.22 17:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.08.23 17:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.08.23 16:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.08.24 16:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.08.25 09:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.08.25 13:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
  {
    startedAt: moment('2021.08.25 14:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
    endedAt: moment('2021.08.26 14:00:00 +9:00', inputFormat).tz(
      timezone,
      true,
    ),
  },
];
