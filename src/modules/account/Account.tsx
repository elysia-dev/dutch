import React, { FunctionComponent, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InitializeEmail from './InitializeEmail';
import Login from './Login';
import LockAccount from './LockAccount';
import CurrentPassword from './CurrentPassword';
import RecoverPassword from './RecoverPassword';
import { AccountPage } from '../../enums/pageEnum';
import CertifyRecover from './CertifyRecover';
import ExpiredAccount from './ExpiredAccount';
import WithdrawnMember from './WithdrawnMember';
import UserContext from '../../contexts/UserContext';
import { SignInStatus } from '../../enums/SignInStatus';
import IntroduceElysia from './IntroduceElysia';

const Stack = createStackNavigator();
export const Account: FunctionComponent = () => {
  const { signedIn } = useContext(UserContext);

  const initialRouteName = () => {
    switch (signedIn) {
      case SignInStatus.DELETE:
        return AccountPage.WithdrawnMember;
      case SignInStatus.EXPIRED:
        return AccountPage.ExpiredAccount;
      default:
        return AccountPage.IntroduceElysia;
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName()}
      headerMode="none"
    >
      <Stack.Screen
        name={AccountPage.IntroduceElysia}
        component={IntroduceElysia}
      />
      <Stack.Screen
        name={AccountPage.InitializeEmail}
        component={InitializeEmail}
      />
      <Stack.Screen name={AccountPage.Login} component={Login} />
      <Stack.Screen name={AccountPage.LockAccount} component={LockAccount} />
      <Stack.Screen
        name={AccountPage.CurrentPassword}
        component={CurrentPassword}
      />
      <Stack.Screen
        name={AccountPage.RecoverPassword}
        component={RecoverPassword}
      />
      <Stack.Screen
        name={AccountPage.CertifyRecover}
        component={CertifyRecover}
      />
      <Stack.Screen
        name={AccountPage.ExpiredAccount}
        component={ExpiredAccount}
      />
      <Stack.Screen
        name={AccountPage.WithdrawnMember}
        component={WithdrawnMember}
      />
    </Stack.Navigator>
  );
};

export default Account;
