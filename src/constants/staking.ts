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

// YYYY.MM.DD hh:mm:ss
// MM.DD.YYYY hh:mm:ss

export const STAKING_POOL_ROUNDS = [
  {
    startedAt: '2021.08.20 00:00:00',
    endedAt: '2021.08.20 23:59:59',
  },
  {
    startedAt: '2021.08.23 00:00:00',
    endedAt: '2021.08.23 23:59:59',
  },
  {
    startedAt: '2021.08.24 00:00:00',
    endedAt: '2021.08.24 23:59:59',
  },
  {
    startedAt: '2021.08.25 00:00:00',
    endedAt: '2021.08.25 23:59:59',
  },
  {
    startedAt: '2021.08.26 00:00:00',
    endedAt: '2021.08.26 23:59:59',
  },
  {
    startedAt: '2021.08.27 00:00:00',
    endedAt: '2021.08.27 23:59:59',
  },
];

import moment from 'moment';

const inputFormat = 'YYYY.MM.DD hh:mm:ss Z';
const outputFormat = 'YYYY.MM.DD hh:mm:ss'; // for ko and zh-hans
// 'MM.DD.YYYY hh:mm:ss' for en

export const STAKING_POOL_ROUNDS_MOMENT = [
  {
    startedAt: moment('2021.08.20 00:00:00 +9:00', inputFormat),
    endedAt: moment('2021.08.20 23:59:59 +9:00', inputFormat),
  },
  {
    startedAt: moment('2021.08.23 00:00:00 +9:00', inputFormat),
    endedAt: moment('2021.08.23 23:59:59 +9:00', inputFormat),
  },
  {
    startedAt: moment('2021.08.24 00:00:00 +9:00', inputFormat),
    endedAt: moment('2021.08.24 23:59:59 +9:00', inputFormat),
  },
  {
    startedAt: moment('2021.08.25 00:00:00 +9:00', inputFormat),
    endedAt: moment('2021.08.25 23:59:59 +9:00', inputFormat),
  },
  {
    startedAt: moment('2021.08.26 00:00:00 +9:00', inputFormat),
    endedAt: moment('2021.08.26 23:59:59 +9:00', inputFormat),
  },
  {
    startedAt: moment('2021.08.27 00:00:00 +9:00', inputFormat),
    endedAt: moment('2021.08.27 23:59:59 +9:00', inputFormat),
  },
];
