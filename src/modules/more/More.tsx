import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountPage, MorePage } from '../../enums/pageEnum';
import MainInfo from './MainInfo';
import MyPage from './Mypage';
import Contact from './Contact';
import Faq from './Faq';
import Transactions from './Transactions';
import ElysiaNotice from './ElysiaNotice';
import ResetPassword from '../account/ResetPassword';
import CurrentPassword from '../account/CurrentPassword';


const Stack = createStackNavigator();

export const More = () => {
  return (
    <Stack.Navigator initialRouteName={MorePage.MainInfo} headerMode="none">
      <Stack.Screen name={MorePage.MainInfo} component={MainInfo} />
      <Stack.Screen name={MorePage.MyPage} component={MyPage} />
      <Stack.Screen name={MorePage.Faq} component={Faq} />
      <Stack.Screen name={MorePage.Contact} component={Contact} />
      <Stack.Screen name={MorePage.Transactions} component={Transactions} />
      <Stack.Screen name={MorePage.ElysiaNotice} component={ElysiaNotice} />
      <Stack.Screen
        name={AccountPage.CurrentPassword}
        component={CurrentPassword}
      />
      <Stack.Screen
        name={AccountPage.ResetPassword}
        component={ResetPassword}
      />
    </Stack.Navigator>
  );
};
