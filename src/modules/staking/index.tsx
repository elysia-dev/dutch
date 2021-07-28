import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';
import { StakingPage } from '../../enums/pageEnum';
import { Main as StakingMain } from './Main';
import CurrentDashboard from './CurrentDashboard';
import TotalDashboard from './TotalDashboard';
import Stake from './Stake';
import SelectUnstakingType from './SelectUnstakingType';
import Unstake from './Unstake';

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
      <RootStack.Screen
        name={StakingPage.CurrentDashboard}
        component={CurrentDashboard}
      />
      <RootStack.Screen
        name={StakingPage.TotalDashboard}
        component={TotalDashboard}
      />
      <RootStack.Screen name={StakingPage.Stake} component={Stake} />
      <RootStack.Screen
        name={StakingPage.SelectUnstakingType}
        component={SelectUnstakingType}
      />
      <RootStack.Screen name={StakingPage.Unstake} component={Unstake} />
    </RootStack.Navigator>
  );
};

export default Main;
