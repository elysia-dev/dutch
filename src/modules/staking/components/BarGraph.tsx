import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import Bar from './Bar';
import {
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
  STAKING_POOL_ROUNDS_MOMENT,
  ROUND_DURATION,
} from '../../../constants/staking';
import CryptoType from '../../../enums/CryptoType';

const BarGraph: React.FC<{ currentRound: number; cryptoType: CryptoType }> = ({
  currentRound,
  cryptoType,
}) => {
  const mintedPerDay =
    cryptoType === CryptoType.EL
      ? ELFI_PER_DAY_ON_EL_STAKING_POOL
      : DAI_PER_DAY_ON_ELFI_STAKING_POOL;

  return (
    <View
      style={{
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      }}>
      {[1, 2, 3, 4, 5, 6].map((i) => {
        // getDotStatus랑 비슷하군..
        const roundStartDate =
          STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].startedAt;
        const roundEndDate =
          STAKING_POOL_ROUNDS_MOMENT[currentRound - 1].endedAt;
        let percent = 0;
        if (currentRound && i < currentRound) {
          percent = 100;
        } else if (
          currentRound &&
          i === currentRound &&
          moment().isBetween(roundStartDate, roundEndDate)
        ) {
          percent =
            (moment().diff(roundStartDate, 'seconds') *
              (mintedPerDay / (3600 * 24))) /
            (mintedPerDay * ROUND_DURATION); // 더미데이터는 기간이 1일이긴 하지만..?
        } else {
          percent = 0;
        }
        return <Bar key={i} round={i} percent={percent} />;
      })}
    </View>
  );
};

export default BarGraph;
