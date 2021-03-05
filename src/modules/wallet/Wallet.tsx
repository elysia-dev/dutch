import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WalletPage } from '../../enums/pageEnum';
import NewPassword from './NewPassword';

const Stack = createStackNavigator();

const Wallet = () => {
  return (
    <Stack.Navigator initialRouteName={WalletPage.NewPassword} headerMode="none">
      <Stack.Screen name={WalletPage.NewPassword} component={NewPassword} />
    </Stack.Navigator>
  );
};

export default Wallet;