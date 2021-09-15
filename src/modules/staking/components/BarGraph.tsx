import React from 'react';
import { View } from 'react-native';
import Bar from './Bar';
import {
  ROUND_DURATIONS,
  ELFI_PER_DAY_ON_EL_STAKING_POOL,
  DAI_PER_DAY_ON_ELFI_STAKING_POOL,
} from '../../../constants/staking';
import CryptoType from '../../../enums/CryptoType';
import calculateMined from '../../../utiles/calculateMined';

const BarGraph: React.FC<{ currentRound: number; cryptoType: CryptoType }> = ({
  currentRound,
  cryptoType,
}) => {
  const minedPerDay =
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
      {[1, 2, 3, 4].map((i) => {
        return (
          <Bar
            key={i}
            round={i}
            percent={
              (calculateMined(cryptoType, i, currentRound) /
                (minedPerDay * ROUND_DURATIONS[i - 1])) *
              100
            }
          />
        );
      })}
    </View>
  );
};

export default BarGraph;
