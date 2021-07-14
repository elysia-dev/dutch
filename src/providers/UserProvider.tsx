import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Server from '../api/server';
import { getToken, removeToken } from '../asyncStorages/token';
import { IS_WALLET_USER } from '../constants/storage';
import UserContext, {
  UserContextState,
  initialUserState,
} from '../contexts/UserContext';
import NotificationStatus from '../enums/NotificationStatus';
import NotificationType from '../enums/NotificationType';
import ProviderType from '../enums/ProviderType';
import SignInStatus, { SignOut } from '../enums/SignInStatus';
import NotificationData from '../types/NotificationData';
import registerForPushNotificationsAsync from '../utiles/registerForPushNotificationsAsync';
import Notification, { isNotification } from '../types/Notification';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';
import moment from 'moment';
import { composeInitialProps } from 'react-i18next';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const UserProvider: React.FC = (props) => {
  const [state, setState] = useState<UserContextState>(initialUserState);

  const signOut = async (signInStatus: SignOut) => {
    await removeToken();
    setState({ ...initialUserState, signedIn: signInStatus });
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
  };

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
            ...initialUserState,
            signedIn: SignInStatus.SIGNOUT,
          });
        });
    } else {
      setState({ ...state, signedIn: SignInStatus.SIGNOUT });
    }
  };

  const refreshUser = async () => {
    if (state.user.provider === ProviderType.GUEST) {
      return;
    }
    state.Server.me()
      .then(async (res) => {
        setState({
          ...state,
          user: res.data.user,
          ownerships: res.data.ownerships,
          balance: res.data.totalBalance,
          signedIn: SignInStatus.SIGNIN,
        });
      })
      .catch((e) => {
        setState({
          ...initialUserState,
          signedIn: SignInStatus.SIGNOUT,
        });
      });
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
            createdAt: moment().toDate(),
          },
          {
            id: 0,
            userId: 0,
            notificationType: NotificationType.ONBOARDING_NEW_USER,
            status: NotificationStatus.UNREAD,
            data: {} as NotificationData,
            createdAt: moment().toDate(),
          },
        ],
      });
    }
  }, [state.signedIn]);

  useEffect(() => {
    if (state.user.provider === ProviderType.GUEST && !state.isWalletUser) {
      return;
    }

    const isTransactionEnd = (type: NotificationType) => {
      return [
        NotificationType.INCREASE_OWNERSHIP,
        NotificationType.DECREASE_OWNERSHIP,
        NotificationType.WITHDRAW_INTEREST,
        NotificationType.FAIL_TRANSACTION,
      ].includes(type);
    };

    const addNotificationReceivedListener =
      Notifications.addNotificationReceivedListener((response) => {
        if (isNotification(response.request.content.data as Notification)) {
          if (
            isTransactionEnd(
              response.request.content.data
                .notificationType as NotificationType,
            )
          ) {
            if (!state.isWalletUser) {
              signIn();
            }
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
      });

    // eslint-disable-next-line max-len
    const addNotificationResponseReceivedListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
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
            if (!state.isWalletUser) {
              signIn();
            }
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
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        addNotificationReceivedListener,
      );
      Notifications.removeNotificationSubscription(
        addNotificationResponseReceivedListener,
      );
    };
  }, [state.isWalletUser, state.signedIn]);

  const newWalletUser = () => {
    setState((state) => {
      return {
        ...state,
        isWalletUser: true,
        notifications: [],
      };
    });
  };

  const setNotifications = (notifications: Notification[]) => {
    setState((state) => {
      return {
        ...state,
        notifications,
      };
    });
  };

  const setEthAddress = (address: string) => {
    setState((state) => {
      return {
        ...state,
        user: { ...state.user, ethAddresses: [address] },
      };
    });
  };

  const setUserExpoPushToken = (expoPushToken: string) => {
    setState((state) => {
      return {
        ...state,
        user: {
          ...state.user,
          expoPushTokens: expoPushToken ? [expoPushToken] : [],
        },
      };
    });
  };

  const setRefundStatus = (legacyRefundStatus: LegacyRefundStatus) => {
    setState((state) => {
      return {
        ...state,
        user: {
          ...state.user,
          legacyWalletRefundStatus: legacyRefundStatus,
        },
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        signIn,
        guestSignIn,
        signOut,
        refreshUser,
        setNotifications,
        setEthAddress,
        setUserExpoPushToken,
        setRefundStatus,
        newWalletUser,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
