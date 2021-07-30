import React from 'react';
import StakingInput from './components/StakingInput';

const Stake: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType } = route.params;

  return (
    <StakingInput cryptoType={cryptoType} actionType="staking" cycle={1} />
  );
};

export default Stake;
