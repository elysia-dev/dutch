import React from 'react';
import StakingInput from './components/StakingInput';

const Stake: React.FC<{ route: any }> = ({ route }) => {
  const { type } = route.params;

  return <StakingInput cryptoType={type} actionType="staking" cycle={1} />;
};

export default Stake;
