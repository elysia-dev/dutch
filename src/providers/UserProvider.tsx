import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Server from '../api/server';
import { getToken, removeToken } from '../asyncStorages/token';
import { IS_WALLET_USER } from '../constants/storage';
import UserContext, {
  UserContextState,
  initialUserState,
} from '../contexts/UserContext';
import ProviderType from '../enums/ProviderType';
import SignInStatus, { SignOut } from '../enums/SignInStatus';
import registerForPushNotificationsAsync from '../utiles/registerForPushNotificationsAsync';
import LegacyRefundStatus from '../enums/LegacyRefundStatus';

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
      });
    }
  }, [state.signedIn]);

  const newWalletUser = () => {
    setState((state) => {
      return {
        ...state,
        isWalletUser: true,
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
