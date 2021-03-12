import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WalletPage } from '../../enums/pageEnum';
import NewPassword from './NewPassword';
import SecureWalletNotice from './SecureWalletNotice';
import UserContext from '../../contexts/UserContext';
import WalletContext from '../../contexts/WalletContext';
import Loading from '../main/Loading';
import SeedPharase from './components/SeedPharase';

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
          <Stack.Screen name={WalletPage.SeedPharase} component={SeedPharase} />
        </>
      }
    </Stack.Navigator>
  );
};

export default WalletMain;