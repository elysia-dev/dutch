import React from 'react';
import StakingInput from './components/StakingInput';

const Unstake: React.FC<{ route: any }> = ({ route }) => {
  const { type } = route.params;

  return <StakingInput cryptoType={type} actionType="unstaking" cycle={1} />;
};

export default Unstake;
