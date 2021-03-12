import React, { useState } from 'react';
import { View } from 'react-native';
import BackupSeedPharase from '../BackupSeedPharase';
import ConfirmSeedPharase from '../ConfirmSeedPharase';

const SeedPharase: React.FC = () => {
  const [stage, setStage] = useState<number>(0);

  return (
    <View>
      {stage === 0 && <BackupSeedPharase next={() => setStage(1)} />}
      {stage === 1 && <ConfirmSeedPharase />}
    </View>
  )
}

export default SeedPharase