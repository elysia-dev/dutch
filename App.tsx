import React, { RefObject, useEffect, useRef, useState } from 'react';
import i18n from 'i18n-js';

import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
// import { AppLoading } from 'expo';
import * as Sentry from 'sentry-expo';

/* eslint-disable @typescript-eslint/camelcase */
import {
  useFonts,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import Pusher from 'pusher-js/react-native';
import { ActivityIndicator } from 'react-native';
import { Kyc } from './src/modules/kyc/Kyc';
import { More } from './src/modules/more/More';
import { Products } from './src/modules/products/Products';
import { Account } from './src/modules/account/Account';

import { KycStatus } from './src/enums/KycStatus';
import LocaleType from './src/enums/LocaleType';
import currentLocale from './src/utiles/currentLocale';
import { Dashboard } from './src/modules/dashboard/Dashboard';
import getPusherClient from './src/api/pusherClient';
import userChannel from './src/utiles/userChannel';
import Main from './src/modules/main/Main';
import Notification from './src/types/Notification';

import RootContext from './src/contexts/RootContext';
import Server from './src/api/server';
import { AccountPage } from './src/enums/pageEnum';
import disablePushNotificationsAsync from './src/utiles/disableNotificationsAsync';
import { SignInStatus } from './src/enums/LoginStatus';

Sentry.init({
  dsn:
    'https://e4dba4697fc743758bd94045d483872b@o449330.ingest.sentry.io/5478998',
  enableInExpoDevelopment: true,
  debug: true,
});

interface AppState {
  signedIn: SignInStatus;
  user: {
    id: number;
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
  signedIn: SignInStatus.PENDING,
  locale: currentLocale(),
  user: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    kycStatus: KycStatus.NONE,
    language: LocaleType.KO,
    ethAddresses: [],
    nationality: 'South Korea, KOR',
  },
  changeLanguage: () => {},
  setKycStatus: () => {},
  unreadNotificationCount: 0,
  notifications: [],
  Server: new Server(() => {}, ''),
};

const App = () => {
  const [state, setState] = useState<AppState>(defaultState);
  const [pusherClient, setPusherClient] = useState<Pusher>();
  const navigationRef = useRef<NavigationContainerRef>(null);

  /* eslint-disable @typescript-eslint/camelcase */
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const signOut = async () => {
    await AsyncStorage.removeItem('@token');
    await disablePushNotificationsAsync(state.user.email);
    setState({ ...defaultState, signedIn: SignInStatus.SIGNOUT });
  };

  const autoSignOut = async () => {
    await AsyncStorage.removeItem('@token');
    console.log(navigationRef.current);
    setState({ ...defaultState, signedIn: SignInStatus.SIGNOUT });
    console.log(navigationRef.current);
    navigationRef.current?.navigate('Account', {
      screen: AccountPage.ExpiredAccount,
    });
  };

  const signIn = async () => {
    const token = await AsyncStorage.getItem('@token');
    const authServer = new Server(autoSignOut, token !== null ? token : '');
    if (token) {
      await authServer
        .me()
        .then(async (res) => {
          i18n.locale = res.data.user.language;
          setState({
            ...state,
            signedIn: SignInStatus.SIGNIN,
            user: res.data.user,
            unreadNotificationCount: res.data.unreadNotificationCount,
            Server: authServer,
          });
          // enablePushNotifications(res.data.user.email);
        })
        .catch((e) => {
          if (state.user?.email) {
            disablePushNotificationsAsync(state.user?.email);
          }
          setState(defaultState);
        });
    } else {
      setState({ ...state, signedIn: SignInStatus.SIGNOUT });
    }
  };

  useEffect(() => {
    signIn();
    getPusherClient().then((client) => {
      setPusherClient(client);
    });
  }, []);

  useEffect(() => {
    if (state.signedIn && state.user.id && pusherClient) {
      const handleNotification = (notification: Notification) => {
        setState({
          ...state,
          unreadNotificationCount: state.unreadNotificationCount + 1,
          notifications: [notification, ...state.notifications],
        });
      };

      const channel = pusherClient.subscribe(userChannel(state.user.id));
      channel.bind('notification', handleNotification);

      return () => channel.unbind('notification', handleNotification);
    } else {
      return () => {};
    }
  }, [
    state.signedIn,
    state.notifications,
    pusherClient,
    state.unreadNotificationCount,
  ]);

  const RootStack = createStackNavigator();

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#3679B5" />;
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
            setState({
              ...state,
              user: { ...state.user, kycStatus: KycStatus.PENDING },
            });
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
            setState({
              ...state,
              user: { ...state.user, ethAddresses: [address] },
            });
          },
        }}>
        <RootStack.Navigator headerMode="none">
          {state.signedIn === SignInStatus.SIGNIN ? (
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
    </NavigationContainer>
  );
};

export default App;
