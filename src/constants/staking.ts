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
    startedAt: '2021.08.04 00:00:00',
    endedAt: '2021.08.04 23:59:59',
  },
  {
    startedAt: '2021.08.05 00:00:00',
    endedAt: '2021.08.05 23:59:59',
  },
  {
    startedAt: '2021.08.06 00:00:00',
    endedAt: '2021.08.06 23:59:59',
  },
  {
    startedAt: '2021.08.09 00:00:00',
    endedAt: '2021.08.09 23:59:59',
  },
  {
    startedAt: '2021.08.10 00:00:00',
    endedAt: '2021.08.10 23:59:59',
  },
  {
    startedAt: '2021.08.11 00:00:00',
    endedAt: '2021.08.11 23:59:59',
  },
];
