import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens'
import Purchase from './Purchase';
import Detail from './Detail';
import { AssetPage } from '../../enums/pageEnum';
import Refund from './Refund';
import Reward from './Reward';
import LegacyOwnershipRefund from './LagacyOwnershipRefund';

enableScreens()

const RootStack = createNativeStackNavigator()

export const Main = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        stackPresentation: 'formSheet'
      }}
    >
      <RootStack.Screen
        name={AssetPage.Detail}
        component={Detail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={AssetPage.Purchase}
        component={Purchase}
      />
      <RootStack.Screen
        name={AssetPage.Refund}
        component={Refund}
      />
      <RootStack.Screen
        name={AssetPage.Reward}
        component={Reward}
      />
      <RootStack.Screen
        name={AssetPage.LegacyOwnershipRefund}
        component={LegacyOwnershipRefund}
      />
    </RootStack.Navigator>
  );
};

export default Main