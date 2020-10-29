import React, { useEffect, useState } from 'react';
import i18n from 'i18n-js';

import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { AppLoading } from 'expo';
import * as Sentry from 'sentry-expo';

/* eslint-disable @typescript-eslint/camelcase */
import {
  useFonts,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import { Kyc } from './src/modules/kyc/Kyc';
import { More } from './src/modules/more/More';
import { Products } from './src/modules/products/Products';
import { Account } from './src/modules/account/Account';

import { KycStatus } from './src/enums/KycStatus';
import LocaleType from './src/enums/LocaleType';
import currentLocale from './src/utiles/currentLocale';
import { Dashboard } from './src/modules/dashboard/Dashboard';
import pusherClient from './src/api/pusherClient';
import userChannel from './src/utiles/userChannel';
import Main from './src/modules/main/Main';
import Notification from './src/types/Notification';

import RootContext from './src/contexts/RootContext';
import Server from './src/api/server';
import { AccountPage } from './src/enums/pageEnum';
import disablePushNotificationsAsync from './src/utiles/disableNotificationsAsync';
import enablePushNotifications from './src/utiles/enableNotifications';

Sentry.init({
  dsn: 'https://e4dba4697fc743758bd94045d483872b@o449330.ingest.sentry.io/5478998',
  enableInExpoDevelopment: true,
  debug: true,
});

interface AppState {
  signedIn: boolean;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: KycStatus;
    gender: string;
    language: LocaleType;
    ethAddresses: string[];
    nationality: string;
  };
  changeLanguage: () => void;
  setKycStatus: () => void;
  unreadNotificationCount: number;
  notifications: Notification[];
  Server: Server;
}

const defaultState = {
  signedIn: false,
  locale: currentLocale(),
  user: {
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    kycStatus: KycStatus.NONE,
    language: LocaleType.KO,
    ethAddresses: [],
    nationality: "South Korea, KOR",
  },
  changeLanguage: () => { },
  setKycStatus: () => { },
  unreadNotificationCount: 0,
  notifications: [],
  Server: new Server(() => { }, ''),
};

const App = () => {
  const [state, setState] = useState<AppState>(defaultState);

  const navigationRef = React.createRef<NavigationContainerRef>();

  /* eslint-disable @typescript-eslint/camelcase */
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const signOut = async () => {
    await AsyncStorage.removeItem('@token');
    await disablePushNotificationsAsync(state.user.email);
    setState(defaultState);
  };

  const autoSignOut = async () => {
    await AsyncStorage.removeItem('@token');
    setState(defaultState);
    navigationRef.current?.navigate('Account', { screen: AccountPage.ExpiredAccount });
  };

  const signIn = async () => {
    const token = await AsyncStorage.getItem('@token');
    const authServer = new Server(autoSignOut, token !== null ? token : '');
    await authServer
      .me()
      .then(async res => {
        i18n.locale = res.data.user.language;
        setState({
          ...state,
          signedIn: true,
          user: res.data.user,
          unreadNotificationCount: res.data.unreadNotificationCount,
          Server: authServer,
        });

        const pusher = await pusherClient();
        const channel = pusher.subscribe(userChannel(res.data.user.id));
        channel.bind('notification', handleNotification);
        enablePushNotifications(res.data.user.email);
      })
      .catch(() => {
        if (state.user?.email) {
          disablePushNotificationsAsync(state.user?.email);
        }
        setState(defaultState);
      });
  };

  useEffect(() => {
    signIn();
  }, []);

  const handleNotification = (notification: Notification) => {
    setState({
      ...state,
      unreadNotificationCount: state.unreadNotificationCount + 1,
      notifications: [notification, ...state.notifications],
    });
  };

  const RootStack = createStackNavigator();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootContext.Provider
        value={{
          ...state,
          changeLanguage: (input) => {
            setState({ ...state, user: { ...state.user, language: input } });
          },
          setKycStatus: () => {
            setState({ ...state, user: { ...state.user, kycStatus: KycStatus.PENDING } });
          },
          signIn,
          signOut,
          autoSignOut,
          setUnreadNotificationCount: (value: number) => {
            setState({
              ...state,
              unreadNotificationCount: value >= 0 ? value : 0,
            });
          },
          setNotifications: (notifications: Notification[]) => {
            setState({ ...state, notifications });
          },
          setEthAddress: (address: string) => {
            setState({ ...state, user: { ...state.user, ethAddresses: [address] } });
          },
        }}>
        <RootStack.Navigator
          headerMode="none"
        >
          {state.signedIn ? (
            <>
              <RootStack.Screen name={'Main'} component={Main} />
              <RootStack.Screen name={'Kyc'} component={Kyc} />
              <RootStack.Screen name={'Dashboard'} component={Dashboard} />
              <RootStack.Screen name={'More'} component={More} />
              <RootStack.Screen name={'Product'} component={Products} />
            </>
          ) : (
              <>
                <RootStack.Screen name={'Account'} component={Account} />
              </>
            )}
        </RootStack.Navigator>
      </RootContext.Provider>
    </NavigationContainer >
  );
};

export default App;
