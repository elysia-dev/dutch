import React from 'react';
import { View } from 'react-native';
import Bar from './Bar';
import {
  ELFI_PER_ROUND_ON_EL_STAKING_POOL,
  DAI_PER_ROUND_ON_ELFI_STAKING_POOL,
} from '../../../constants/staking';
import CryptoType from '../../../enums/CryptoType';
import calculateMinted from '../../../utiles/calculateMinted';

const BarGraph: React.FC<{ currentRound: number; cryptoType: CryptoType }> = ({
  currentRound,
  cryptoType,
}) => {
  const mintedPerRound =
    cryptoType === CryptoType.EL
      ? ELFI_PER_ROUND_ON_EL_STAKING_POOL
      : DAI_PER_ROUND_ON_ELFI_STAKING_POOL;

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
        return (
          <Bar
            key={i}
            round={i}
            percent={
              (calculateMinted(cryptoType, i, currentRound) / mintedPerRound) *
              100
            }
          />
        );
      })}
    </View>
  );
};

export default BarGraph;
