import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens'
import Detail from './Detail';
import Deposit from './Deposit';
import { CryptoPage } from '../../enums/pageEnum';
import Withdrawal from './Withdrawal';

enableScreens()

const RootStack = createNativeStackNavigator()

export const Main = () => {
  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
        stackPresentation: 'formSheet'
      }}
    >
      <RootStack.Screen
        name={CryptoPage.Detail}
        component={Detail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={CryptoPage.Deposit}
        component={Deposit}
      />
      <RootStack.Screen
        name={CryptoPage.Withdrawal}
        component={Withdrawal}
      />
    </RootStack.Navigator>
  );
};

export default Main