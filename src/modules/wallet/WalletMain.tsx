import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WalletPage } from '../../enums/pageEnum';
import NewPassword from './NewPassword';
import SecureWalletNotice from './SecureWalletNotice';
import BackupSeedPharase from './BackupSeedPharase';
import ConfirmSeedPharase from './ConfirmSeedPharase';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import Loading from '../main/Loading';

const Stack = createStackNavigator();

const WalletMain = () => {
  const { isWalletUser } = useContext(UserContext);
  const { isUnlocked } = useContext(WalletContext);

  return (
    <Stack.Navigator
      initialRouteName={WalletPage.NewPassword}
      headerMode="none"
    >
      {
        !isWalletUser && <>
          <Stack.Screen name={WalletPage.NewPassword} component={NewPassword} />
        </>
      }
      {
        isWalletUser && !isUnlocked && <Stack.Screen name={WalletPage.CreatingWallet} component={Loading} />
      }
      {
        isWalletUser && isUnlocked && <>
          <Stack.Screen name={WalletPage.SecureWalletNotice} component={SecureWalletNotice} />
          <Stack.Screen name={WalletPage.BackupSeedPharase} component={BackupSeedPharase} />
          <Stack.Screen name={WalletPage.ConfirmSeedPharase} component={ConfirmSeedPharase} />
        </>
      }
    </Stack.Navigator>
  );
};

export default WalletMain;