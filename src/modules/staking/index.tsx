import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';
import { StakingPage } from '../../enums/pageEnum';
import { Main as StakingMain } from './Main';
import Dashboard from './Dashboard';

enableScreens();

const RootStack = createNativeStackNavigator();

export const Main = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        stackPresentation: 'formSheet',
      }}>
      <RootStack.Screen name={StakingPage.Main} component={StakingMain} />
      <RootStack.Screen name={StakingPage.Dashboard} component={Dashboard} />
    </RootStack.Navigator>
  );
};

export default Main;
