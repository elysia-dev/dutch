import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardPage } from '../../enums/pageEnum';
import { Main } from './Main';
import InvestmentGuide from './InvestmentGuide';
import RemainingBalance from './RemainingBalance';

const Stack = createStackNavigator();

export const Dashboard = () => {
  return (
    <Stack.Navigator initialRouteName={DashboardPage.Main} headerMode="none">
      <Stack.Screen name={DashboardPage.Main} component={Main} />
      <Stack.Screen
        name={DashboardPage.InvestmentGuide}
        component={InvestmentGuide}
      />
      <Stack.Screen
        name={DashboardPage.RemainingBalance}
        component={RemainingBalance}
      />
    </Stack.Navigator>
  );
};
