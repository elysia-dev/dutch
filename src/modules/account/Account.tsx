import React, { FunctionComponent, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InitializeEmail from './InitializeEmail';
import Signup from './Signup';
import Login from './Login';
import LockAccount from './LockAccount';
import CurrentPassword from './CurrentPassword';
import RecoverPassword from './RecoverPassword';
import CertifySignup from './CertifySignup';
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

  return (
    <Stack.Navigator
      initialRouteName={
        // eslint-disable-next-line no-nested-ternary
        signedIn === SignInStatus.DELETE
          ? AccountPage.WithdrawnMember
          : signedIn === SignInStatus.EXPIRED
          ? AccountPage.ExpiredAccount
          : AccountPage.IntroduceElysia
      }
      headerMode="none">
      <Stack.Screen
        name={AccountPage.IntroduceElysia}
        component={IntroduceElysia}
      />
      <Stack.Screen
        name={AccountPage.InitializeEmail}
        component={InitializeEmail}
      />
      <Stack.Screen
        name={AccountPage.Signup}
        component={Signup}
        options={{
          gestureEnabled: false,
        }}
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
        name={AccountPage.CertifySignup}
        component={CertifySignup}
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
