import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardPage } from '../../enums/pageEnum';
import { Main } from './Main';
import { SummaryReport } from './SummaryReport';
import OwnershipDetail from './OwnershipDetail';
import ProductData from './ProductData';
import ProductNotice from './ProductNotice';
import PreparingInvestment from './PreparingInvestment';
import InterestWithdraw from './InterestWithdraw';
import InvestmentGuide from './InvestmentGuide';
import { RemainingBalance } from './RemainingBalance';
import { EventList } from './EventList';

const Stack = createStackNavigator();

export const Dashboard = () => {
  return (
    <Stack.Navigator initialRouteName={DashboardPage.Main} headerMode="none">
      <Stack.Screen name={DashboardPage.Main} component={Main} />
      <Stack.Screen
        name={DashboardPage.SummaryReport}
        component={SummaryReport}
      />
      <Stack.Screen
        name={DashboardPage.OwnershipDetail}
        component={OwnershipDetail}
      />
      <Stack.Screen name={DashboardPage.ProductData} component={ProductData} />
      <Stack.Screen
        name={DashboardPage.ProductNotice}
        component={ProductNotice}
      />
      <Stack.Screen
        name={DashboardPage.InvestmentGuide}
        component={InvestmentGuide}
      />
      <Stack.Screen
        name={DashboardPage.PreparingInvestment}
        component={PreparingInvestment}
      />
      <Stack.Screen
        name={DashboardPage.InterestWithdraw}
        component={InterestWithdraw}
      />
      <Stack.Screen
        name={DashboardPage.RemainingBalance}
        component={RemainingBalance}
      />
      <Stack.Screen name={DashboardPage.EventList} component={EventList} />
    </Stack.Navigator>
  );
};
