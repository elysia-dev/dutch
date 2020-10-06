import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MorePage } from '../../enums/pageEnum';
import MainInfo from './MainInfo';
import MyPage from './Mypage';
import Contact from './Contact';
import Transactions from './Transactions';
import ElysiaNotice from './ElysiaNotice';

const Stack = createStackNavigator();

export const More = () => {
  return (
    <Stack.Navigator initialRouteName={MorePage.MainInfo} headerMode="none">
      <Stack.Screen name={MorePage.MainInfo} component={MainInfo} />
      <Stack.Screen name={MorePage.MyPage} component={MyPage} />
      <Stack.Screen name={MorePage.Contact} component={Contact} />
      <Stack.Screen name={MorePage.Transactions} component={Transactions} />
      <Stack.Screen name={MorePage.ElysiaNotice} component={ElysiaNotice} />
    </Stack.Navigator>
  );
};
