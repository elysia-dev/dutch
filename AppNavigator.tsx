/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from "react-native-flash-message";
import { More } from './src/modules/more/More';
import { Products } from './src/modules/products/Products';
import { Account } from './src/modules/account/Account';
import { Dashboard } from './src/modules/dashboard/Dashboard';
import Main from './src/modules/main/Main';
import Wallet from './src/modules/wallet/WalletMain';
import { SignInStatus } from './src/enums/SignInStatus';
import BlockScreen from './src/modules/main/BlockScreen';
import Loading from './src/modules/main/Loading';
import { AccountPage, Page } from './src/enums/pageEnum';
import UserContext from './src/contexts/UserContext';
import WalletContext from './src/contexts/WalletContext';
import WalletLogin from './src/modules/account/WalletLogin';
import WalletRecover from './src/modules/account/WalletRecover';

const AppNavigator: React.FC<{ navigationRef: React.Ref<NavigationContainerRef> }> = ({ navigationRef }) => {
  const RootStack = createStackNavigator();
  const { signedIn, isWalletUser } = useContext(UserContext);
  const { isUnlocked } = useContext(WalletContext);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator headerMode="none">
        {signedIn === SignInStatus.PENDING ? (
          <RootStack.Screen
            name={Page.LoadingScreen}
            component={Loading}
            options={{ animationEnabled: false }}
          />
        ) : isWalletUser && !isUnlocked ? (
          <>
            <RootStack.Screen name={Page.Account} component={WalletLogin} />
            <RootStack.Screen name={AccountPage.WalletRecover} component={WalletRecover} />
          </>
        ) : signedIn === SignInStatus.SIGNIN ? (
          <>
            <RootStack.Screen name={Page.Main} component={Main} />
            <RootStack.Screen name={Page.Dashboard} component={Dashboard} />
            <RootStack.Screen name={Page.More} component={More} />
            <RootStack.Screen name={Page.Product} component={Products} />
            <RootStack.Screen name={Page.Wallet} component={Wallet} />
          </>
        ) : (
          <>
            <RootStack.Screen name={Page.Account} component={Account} />
          </>
        )}
        <RootStack.Screen
          name={Page.BlockScreen}
          component={BlockScreen}
          options={{ animationEnabled: false }}
        />
      </RootStack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer >
  );
};

export default AppNavigator;
