import React from 'react';
import StakingInput from './components/StakingInput';

const Unstake: React.FC<{ route: any }> = ({ route }) => {
  const { cryptoType } = route.params;

  return (
    <StakingInput cryptoType={cryptoType} actionType="unstaking" cycle={1} />
  );
};

export default Unstake;
