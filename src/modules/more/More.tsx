import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MorePage } from '../../enums/pageEnum';
import MainInfo from './MainInfo';
import MyPage from './Mypage';
import { OwnershipHistory } from './OwnershipHistory';
import { TransactionHistory } from './TransactionHistory';
import Contact from './Contact';
import Faq from './Faq';

const Stack = createStackNavigator();

export const More = () => {
  return (
    <Stack.Navigator initialRouteName={MorePage.MainInfo} headerMode="none">
      <Stack.Screen name={MorePage.MainInfo} component={MainInfo} />
      <Stack.Screen name={MorePage.MyPage} component={MyPage} />
      <Stack.Screen
        name={MorePage.OwnershipHistory}
        component={OwnershipHistory}
      />
      <Stack.Screen
        name={MorePage.TransactionHistory}
        component={TransactionHistory}
      />
      <Stack.Screen name={MorePage.Faq} component={Faq} />
      <Stack.Screen name={MorePage.Contact} component={Contact} />
    </Stack.Navigator>
  );
};
