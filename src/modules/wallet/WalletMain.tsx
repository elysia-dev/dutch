import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WalletPage } from '../../enums/pageEnum';
import NewPassword from './NewPassword';
import ConfirmPassword from './ConfirmPassword';
import SecureWalletNotice from './SecureWalletNotice';
import BackupSeedPharase from './BackupSeedPharase';
import ConfirmSeedPharase from './ConfirmSeedPharase';

const Stack = createStackNavigator();

const WalletMain = () => {
  return (
    <Stack.Navigator initialRouteName={WalletPage.NewPassword} headerMode="none">
      <Stack.Screen name={WalletPage.NewPassword} component={NewPassword} />
      <Stack.Screen name={WalletPage.ConfirmPassword} component={ConfirmPassword} />
      <Stack.Screen name={WalletPage.SecureWalletNotice} component={SecureWalletNotice} />
      <Stack.Screen name={WalletPage.BackupSeedPharase} component={BackupSeedPharase} />
      <Stack.Screen name={WalletPage.ConfirmSeedPharase} component={ConfirmSeedPharase} />
    </Stack.Navigator>
  );
};

export default WalletMain;