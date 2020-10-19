import React, { useEffect, useState } from 'react';
import i18n from 'i18n-js';

import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { AppLoading } from 'expo';
import {
  useFonts,
  Roboto_300Light as Roboto300,
  Roboto_400Regular as Roboto400,
  Roboto_700Bold as Roboto700,
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

import StorybookUI from './storybook/index';
import RootContext from './src/contexts/RootContext';
import Server from './src/api/server';
import { AccountPage } from './src/enums/pageEnum';

interface AppState {
  signedIn: boolean;
  locale: LocaleType;
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
  unreadNotificationCount: 0,
  notifications: [],
  Server: new Server(() => { }, ''),
};

const App = () => {
  const [state, setState] = useState<AppState>(defaultState);

  const navigationRef = React.createRef<NavigationContainerRef>();

  const [fontsLoaded] = useFonts({
    Roboto300,
    Roboto400,
    Roboto700,
  });

  const signOut = async () => {
    await AsyncStorage.removeItem('@token');
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
        // if (res.data.user.language !== this.state.locale) {
        i18n.locale = res.data.user.language;
        // }
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
      })
      .catch(() => {
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
          changeLanguage: (input) => { setState({ ...state, locale: input }); },
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
          screenOptions={{
            gestureEnabled: false,
          }}>
          {state.signedIn ? (
            <>
              <RootStack.Screen name={'Main'} component={Main} />
              {state.user.kycStatus === KycStatus.NONE && (
                <RootStack.Screen name={'Kyc'} component={Kyc} />
              )}
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

const STORY_BOOK_ENABLED = false;

const AppContainer = () =>
  __DEV__ && STORY_BOOK_ENABLED ? <StorybookUI /> : <App />;

export default AppContainer;
