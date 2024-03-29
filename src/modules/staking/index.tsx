import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from 'react-native-screens';
import { StakingPage } from '../../enums/pageEnum';
import { Main as StakingMain } from './Main';
import CurrentDashboard from './CurrentDashboard';
import TotalDashboard from './TotalDashboard';
import Stake from './Stake';
import Unstake from './Unstake';
import UnstakeAndMigrate from './UnstakeAndMigrate';
import Reward from './Reward';

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
      <RootStack.Screen name={StakingPage.Unstake} component={Unstake} />
      <RootStack.Screen
        name={StakingPage.UnstakeAndMigrate}
        component={UnstakeAndMigrate}
      />
      <RootStack.Screen name={StakingPage.Reward} component={Reward} />
    </RootStack.Navigator>
  );
};

export default Main;
