import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountPage, MorePage } from '../../enums/pageEnum';
import MainInfo from './MainInfo';
import Contact from './Contact';
import Setting from './Setting';
import ResetPassword from '../account/ResetPassword';
import CurrentPassword from '../account/CurrentPassword';
import RegisterEthAddress from './RegisterEthAddress';
import TermsOfUse from './TermsOfUse';
import PrivacyPolicy from './PrivacyPolicy';
import WhatsNew from './WhatsNew';
import MembershipWithdrawl from './MembershipWithdrawl';
import Asset2Ownership from './Asset2Ownership';
import CheckMnemonic from './CheckMnemonic';
import MyPage from './MyPage';

const Stack = createStackNavigator();

export const More = () => {
  return (
    <Stack.Navigator initialRouteName={MorePage.MainInfo} headerMode="none">
      <Stack.Screen name={MorePage.MainInfo} component={MainInfo} />
      <Stack.Screen name={MorePage.Contact} component={Contact} />
      <Stack.Screen name={MorePage.Setting} component={Setting} />
      <Stack.Screen name={MorePage.TermsOfUse} component={TermsOfUse} />
      <Stack.Screen name={MorePage.PrivacyPolicy} component={PrivacyPolicy} />
      <Stack.Screen name={MorePage.Asset2Ownership} component={Asset2Ownership} />
      <Stack.Screen
        name={AccountPage.CurrentPassword}
        component={CurrentPassword}
      />
      <Stack.Screen
        name={AccountPage.ResetPassword}
        component={ResetPassword}
      />
      <Stack.Screen
        name={MorePage.RegisterEthAddress}
        component={RegisterEthAddress}
      />
      <Stack.Screen
        name={MorePage.WhatsNew}
        component={WhatsNew}
      />
      <Stack.Screen
        name={MorePage.MembershipWithdrawl}
        component={MembershipWithdrawl}
      />
      <Stack.Screen
        name={MorePage.MyPage}
        component={MyPage}
      />
      <Stack.Screen name={MorePage.CheckMnemonic} component={CheckMnemonic} />
    </Stack.Navigator>
  );
};
