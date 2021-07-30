import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WalletPage } from '../../enums/pageEnum';
import NewPassword from './NewPassword';
import SecureWalletNotice from './SecureWalletNotice';
import SeedPharase from './components/SeedPharase';
import SelectMethod from './SelectMethod';
import RecoverSeedPharase from './RecoverSeedPharase';
import RecoverWallet from './RecoverWallet';

const Stack = createStackNavigator();

const WalletMain = () => {
  return (
    <Stack.Navigator
      initialRouteName={WalletPage.SelecteMethod}
      headerMode={'none'}>
      <Stack.Screen name={WalletPage.SelecteMethod} component={SelectMethod} />
      <Stack.Screen
        name={WalletPage.RecoverSeedPharase}
        component={RecoverSeedPharase}
      />
      <Stack.Screen name={WalletPage.NewPassword} component={NewPassword} />
      <Stack.Screen
        name={WalletPage.SecureWalletNotice}
        component={SecureWalletNotice}
      />
      <Stack.Screen name={WalletPage.SeedPharase} component={SeedPharase} />
      <Stack.Screen name={WalletPage.RecoverWallet} component={RecoverWallet} />
    </Stack.Navigator>
  );
};

export default WalletMain;
