import React, { useState } from 'react';
import BackupSeedPharase from '../BackupSeedPharase';
import ConfirmSeedPharase from '../ConfirmSeedPharase';

const SeedPharase: React.FC = () => {
  const [stage, setStage] = useState<number>(0);

  return (
    <>
      {stage === 0 && <BackupSeedPharase next={() => setStage(1)} />}
      {stage === 1 && <ConfirmSeedPharase />}
    </>
  );
};

export default SeedPharase;
