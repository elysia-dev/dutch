/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';

import {
  NavigationContainerRef,
} from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

import {
  AppState,
  AppStateStatus,
} from 'react-native';

import LegacyRefundStatus from './src/enums/LegacyRefundStatus';
import Notification, { isNotification } from './src/types/Notification';

import UserContext from './src/contexts/UserContext';
import FunctionContext from './src/contexts/FunctionContext';
import Server from './src/api/server';

import registerForPushNotificationsAsync from './src/utiles/registerForPushNotificationsAsync';
import { SignInStatus, SignOut } from './src/enums/SignInStatus';
import { OwnershipResponse } from './src/types/AccountResponse';
import NotificationType from './src/enums/NotificationType';
import NotificationStatus from './src/enums/NotificationStatus';
import NotificationData from './src/types/NotificationData';
import ProviderType from './src/enums/ProviderType';
import { getToken, removeToken } from './src/asyncStorages/token';
import WalletProvider from './src/providers/WalletProvider';
import AsyncStorage from '@react-native-community/async-storage';
import { IS_WALLET_USER } from './src/constants/storage';
import AppNavigator from './AppNavigator';
import PreferenceProvider from './src/providers/PreferenceProvider';
import PriceProvider from './src/providers/PriceProvider';

interface AppInformation {
  signedIn: SignInStatus;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    ethAddresses: string[];
    expoPushTokens: string[];
    nationality: string;
    legacyEl: number;
    legacyUsd: number;
    legacyWalletRefundStatus: LegacyRefundStatus;
    legacyAsset2Value: number;
    provider: ProviderType;
  };
  ownerships: OwnershipResponse[];
  balance: string;
  notifications: Notification[];
  Server: Server;
  expoPushToken: string;
  elPrice: number;
  krwPrice: number;
  cnyPrice: number;
  isWalletUser: boolean;
}

const defaultState = {
  signedIn: SignInStatus.PENDING,
  user: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    ethAddresses: [],
    expoPushTokens: [],
    nationality: 'South Korea, KOR',
    legacyEl: 0,
    legacyUsd: 0,
    legacyWalletRefundStatus: LegacyRefundStatus.NONE,
    legacyAsset2Value: 0,
    provider: ProviderType.GUEST,
  },
  ownerships: [],
  balance: '0',
  notifications: [],
  Server: new Server(() => { }, ''),
  expoPushToken: '',
  elPrice: 0,
  krwPrice: 0,
  cnyPrice: 0,
  isWalletUser: false,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const AppMain = () => {
  const [state, setState] = useState<AppInformation>(defaultState);
  const navigationRef = useRef<NavigationContainerRef>(null);

  const appState = useRef(AppState.currentState);


  const signOut = async (signInStatus: SignOut) => {
    await removeToken();
    setState({ ...defaultState, signedIn: signInStatus });
  };

  const guestSignIn = async () => {
    const authServer = new Server(signOut, '');
    const isWalletUser = await AsyncStorage.getItem(IS_WALLET_USER);

    setState({
      ...state,
      signedIn: SignInStatus.SIGNIN,
      Server: authServer,
      isWalletUser: isWalletUser === 'true',
    });
  }

  const signIn = async () => {
    const isWalletUser = await AsyncStorage.getItem(IS_WALLET_USER);

    if (isWalletUser === 'true') {
      return guestSignIn();
    }

    const token = await getToken();
    const authServer = new Server(signOut, token !== null ? token : '');
    if (token) {
      await authServer
        .me()
        .then(async (res) => {
          setState({
            ...state,
            signedIn: SignInStatus.SIGNIN,
            user: {
              ...res.data.user,
              ethAddresses: res.data.user.ethAddresses || [],
            },
            notifications: res.data.notifications || [],
            ownerships: res.data.ownerships || [],
            balance: res.data.totalBalance,
            Server: authServer,
          });
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
    if (state.user.provider === ProviderType.GUEST) {
      return
    }

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
    signIn();
  }, []);

  useEffect(() => {
    if (state.user.provider === ProviderType.GUEST && !state.isWalletUser) {
      // Guest Notifications
      setState({
        ...state,
        notifications: [
          {
            id: 1,
            userId: 0,
            notificationType: NotificationType.ONBOARDING_CONNECT_WALLET,
            status: NotificationStatus.UNREAD,
            data: {} as NotificationData,
            createdAt: new Date(),
          },
          {
            id: 0,
            userId: 0,
            notificationType: NotificationType.ONBOARDING_NEW_USER,
            status: NotificationStatus.UNREAD,
            data: {} as NotificationData,
            createdAt: new Date(),
          },
        ],
      });
    }
  }, [state.signedIn]);

  useEffect(() => {
    if (state.user.provider === ProviderType.GUEST) {
      return;
    }

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

  return (
    <UserContext.Provider
      value={{
        signedIn: state.signedIn,
        user: state.user,
        ownerships: state.ownerships,
        balance: state.balance,
        notifications: state.notifications,
        expoPushToken: state.expoPushToken,
        isWalletUser: state.isWalletUser,
      }}>
      <FunctionContext.Provider
        value={{
          signIn,
          guestSignIn,
          signOut,
          refreshUser,
          newWalletUser: () => {
            setState({
              ...state,
              isWalletUser: true,
              notifications: []
            })
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
          setUserExpoPushToken: (expoPushToken: string) => {
            setState({
              ...state,
              user: {
                ...state.user,
                expoPushTokens: expoPushToken ? [expoPushToken] : [],
              },
            });
          },
          setIsWalletUser: (isWalletUser: boolean) => {
            setState({
              ...state,
              isWalletUser: isWalletUser,
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
          Server: state.Server,
        }}>
        <WalletProvider>
          <PreferenceProvider>
            <PriceProvider>
              <AppNavigator navigationRef={navigationRef} />
            </PriceProvider>
          </PreferenceProvider>
        </WalletProvider>
      </FunctionContext.Provider>
    </UserContext.Provider>
  );
};

export default AppMain;
