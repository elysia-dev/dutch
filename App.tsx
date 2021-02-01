/* eslint-disable no-nested-ternary */
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import i18n from 'i18n-js';

import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
// import { AppLoading } from 'expo';
import * as Sentry from 'sentry-expo';
import * as Notifications from 'expo-notifications';

/* eslint-disable @typescript-eslint/camelcase */
import {
  useFonts,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import {
  ActivityIndicator,
  View,
  AppState,
  AppStateStatus,
  Platform,
  Alert,
} from 'react-native';
import { Kyc } from './src/modules/kyc/Kyc';
import { More } from './src/modules/more/More';
import { Products } from './src/modules/products/Products';
import { Account } from './src/modules/account/Account';

import { KycStatus } from './src/enums/KycStatus';
import LocaleType from './src/enums/LocaleType';
import LegacyRefundStatus from './src/enums/LegacyRefundStatus';
import currentLocale from './src/utiles/currentLocale';
import { Dashboard } from './src/modules/dashboard/Dashboard';
import Main from './src/modules/main/Main';
import Notification, { isNotification } from './src/types/Notification';

import RootContext from './src/contexts/RootContext';
import Server from './src/api/server';

import registerForPushNotificationsAsync from './src/utiles/registerForPushNotificationsAsync';
import { SignInStatus, SignOut } from './src/enums/SignInStatus';
import CurrencyType from './src/enums/CurrencyType';
import { CurrencyResponse } from './src/types/CurrencyResponse';
import BlockScreen from './src/modules/main/BlockScreen';
import { OwnershipResponse } from './src/types/AccountResponse';
import getEnvironment from './src/utiles/getEnvironment';
import storeDeeplink from './src/utiles/storeDeeplink';
import NotificationType from './src/enums/NotificationType';
import Loading from './src/modules/main/Loading';

Sentry.init({
  dsn:
    'https://e4dba4697fc743758bd94045d483872b@o449330.ingest.sentry.io/5478998',
  enableInExpoDevelopment: true,
  debug: true,
});

interface AppInformation {
  signedIn: SignInStatus;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: KycStatus;
    gender: string;
    language: LocaleType;
    currency: CurrencyType;
    ethAddresses: string[];
    expoPushTokens: string[];
    nationality: string;
    legacyEl: number;
    legacyUsd: number;
    legacyWalletRefundStatus: LegacyRefundStatus;
  };
  ownerships: OwnershipResponse[];
  balance: string;
  changeLanguage: () => void;
  setKycStatus: () => void;
  notifications: Notification[];
  Server: Server;
  expoPushToken: string;
  elPrice: number;
  krwPrice: number;
  cnyPrice: number;
}

const defaultState = {
  signedIn: SignInStatus.PENDING,
  user: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    kycStatus: KycStatus.NONE,
    language: currentLocale(),
    currency: CurrencyType.USD,
    ethAddresses: [],
    expoPushTokens: [],
    nationality: 'South Korea, KOR',
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
  },
  ownerships: [],
  balance: '0',
  changeLanguage: () => {},
  setKycStatus: () => {},
  notifications: [],
  Server: new Server(() => {}, ''),
  expoPushToken: '',
  elPrice: 0,
  krwPrice: 0,
  cnyPrice: 0,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [state, setState] = useState<AppInformation>(defaultState);
  const navigationRef = useRef<NavigationContainerRef>(null);

  const appState = useRef(AppState.currentState);

  /* eslint-disable @typescript-eslint/camelcase */
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const [currencyState, setCurrencyState] = useState({
    currencyUnit: '$',
    currencyRatio: 1,
  });
  const { currencyUnit, currencyRatio } = currencyState;

  const signOut = async (signInStatus: SignOut) => {
    await AsyncStorage.removeItem('@token');
    setState({ ...defaultState, signedIn: signInStatus });
  };

  const signIn = async () => {
    const token = await AsyncStorage.getItem('@token');
    const authServer = new Server(signOut, token !== null ? token : '');
    if (token) {
      await authServer
        .me()
        .then(async (res) => {
          i18n.locale = res.data.user.language;
          const allCurrency = (await authServer.getAllCurrency()).data;
          setState({
            ...state,
            signedIn: SignInStatus.SIGNIN,
            user: res.data.user,
            notifications: res.data.notifications || [],
            ownerships: res.data.ownerships || [],
            balance: res.data.totalBalance,
            Server: authServer,
            elPrice: allCurrency.find((cr) => cr.code === 'EL')?.rate || 0.003,
            krwPrice: allCurrency.find((cr) => cr.code === 'KRW')?.rate || 1080,
            cnyPrice:
              allCurrency.find((cr) => cr.code === 'CNY')?.rate || 6.53324,
          });
          console.log('signIn!');
          registerForPushNotificationsAsync().then((expoPushToken) => {
            if (token && expoPushToken) {
              authServer.registerExpoPushToken(expoPushToken).then(() => {
                setState((state) => {
                  return {
                    ...state,
                    user: {
                      ...state.user,
                      expoPushTokens: [expoPushToken],
                    },
                    expoPushToken,
                  };
                });
              });
            }
          });
        })
        .catch((_e) => {
          setState({
            ...defaultState,
            signedIn: SignInStatus.SIGNOUT,
          });
        });
    } else {
      setState({ ...state, signedIn: SignInStatus.SIGNOUT });
    }
  };

  const refreshUser = async () => {
    state.Server.me()
      .then(async (res) => {
        setState({
          ...state,
          user: res.data.user,
          ownerships: res.data.ownerships,
          balance: res.data.totalBalance,
          notifications: res.data.notifications || [],
          signedIn: SignInStatus.SIGNIN,
        });
      })
      .catch((e) => {
        setState({
          ...defaultState,
          signedIn: SignInStatus.SIGNOUT,
        });
      });
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current !== 'active' &&
      nextAppState === 'active' &&
      navigationRef.current?.getCurrentRoute()?.name !== 'NotificationMain'
    ) {
      navigationRef.current?.goBack();
    } else if (appState.current === 'active' && nextAppState !== 'active') {
      navigationRef.current?.navigate('BlockScreen');
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    i18n.locale = state.user.language;
    signIn();
  }, []);

  useEffect(() => {
    if (state.user.currency === CurrencyType.KRW) {
      setCurrencyState({
        ...currencyState,
        currencyUnit: '₩',
        currencyRatio: state.krwPrice,
      });
    } else if (state.user.currency === CurrencyType.CNY) {
      setCurrencyState({
        ...currencyState,
        currencyUnit: '¥',
        currencyRatio: state.cnyPrice,
      });
    } else {
      setCurrencyState({
        ...currencyState,
        currencyUnit: '$',
        currencyRatio: 1,
      });
    }
  }, [state.user.currency]);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    const isTransactionEnd = (type: NotificationType) => {
      return [
        NotificationType.INCREASE_OWNERSHIP,
        NotificationType.DECREASE_OWNERSHIP,
        NotificationType.WITHDRAW_INTEREST,
        NotificationType.FAIL_TRANSACTION,
      ].includes(type);
    };

    const addNotificationReceivedListener = Notifications.addNotificationReceivedListener(
      (response) => {
        if (isNotification(response.request.content.data as Notification)) {
          if (
            isTransactionEnd(
              response.request.content.data
                .notificationType as NotificationType,
            )
          ) {
            signIn();
          } else {
            setState((state) => {
              return {
                ...state,
                notifications: [
                  response.request.content.data as Notification,
                  ...state.notifications,
                ],
              };
            });
          }
        }
      },
    );

    // eslint-disable-next-line max-len
    const addNotificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (
          isNotification(
            response.notification.request.content.data as Notification,
          )
        ) {
          if (
            isTransactionEnd(
              response.notification.request.content.data
                .notificationType as NotificationType,
            )
          ) {
            signIn();
          } else {
            setState((state) => {
              return {
                ...state,
                notifications: [
                  response.notification.request.content.data as Notification,
                  ...state.notifications,
                ],
              };
            });
          }
          navigationRef.current?.navigate('NotificationMain');
        }
      },
    );

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);

      Notifications.removeNotificationSubscription(
        addNotificationReceivedListener,
      );
      Notifications.removeNotificationSubscription(
        addNotificationResponseReceivedListener,
      );
    };
  }, []);

  const RootStack = createStackNavigator();

  if (!fontsLoaded) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ActivityIndicator size="large" color="#3679B5" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootContext.Provider
        value={{
          ...state,
          changeLanguage: (newLanguage: LocaleType) => {
            setState({
              ...state,
              user: { ...state.user, language: newLanguage },
            });
          },
          changeCurrency: (newCurrency: CurrencyType) => {
            setState({
              ...state,
              user: { ...state.user, currency: newCurrency },
            });
          },
          setKycStatus: () => {
            setState({
              ...state,
              user: { ...state.user, kycStatus: KycStatus.PENDING },
            });
          },
          signIn,
          signOut,
          setCurrencyPrice: (currency: CurrencyResponse[]) => {
            const elPrice = currency.find((cr) => cr.code === 'EL')?.rate;
            const krwPrice = currency.find((cr) => cr.code === 'KRW')?.rate;
            const cnyPrice = currency.find((cr) => cr.code === 'CNY')?.rate;
            if (elPrice && krwPrice && cnyPrice) {
              setState({
                ...state,
                elPrice,
                krwPrice,
                cnyPrice,
              });
            }
          },
          setNotifications: (notifications: Notification[]) => {
            setState({
              ...state,
              notifications,
            });
          },
          setEthAddress: (address: string) => {
            setState({
              ...state,
              user: { ...state.user, ethAddresses: [address] },
            });
          },
          setRefundStatus: (legacyRefundStatus: LegacyRefundStatus) => {
            setState({
              ...state,
              user: {
                ...state.user,
                legacyWalletRefundStatus: legacyRefundStatus,
              },
            });
          },
          setUserExpoPushToken: (expoPushToken: string) => {
            setState({
              ...state,
              user: {
                ...state.user,
                expoPushTokens: expoPushToken ? [expoPushToken] : [],
              },
            });
          },
          currencyUnit,
          currencyRatio,
          refreshUser,
          // pushNotificationId,
        }}>
        <RootStack.Navigator headerMode="none">
          {state.signedIn === SignInStatus.PENDING ? (
            <RootStack.Screen
              name={'LoadingScreen'}
              component={Loading}
              options={{ animationEnabled: false }}
            />
          ) : state.signedIn === SignInStatus.SIGNIN ? (
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
          <RootStack.Screen
            name={'BlockScreen'}
            component={BlockScreen}
            options={{ animationEnabled: false }}
          />
        </RootStack.Navigator>
      </RootContext.Provider>
    </NavigationContainer>
  );
};

export default App;
