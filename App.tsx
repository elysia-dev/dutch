import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import { Kyc } from './src/modules/kyc/Kyc';
import { More } from './src/modules/more/More';
import { Products } from './src/modules/products/Products';
import { Account } from './src/modules/account/Account';

import UserContext from './src/contexts/UserContext';
import { KycStatus } from './src/enums/KycStatus';
import Api from './src/api/account';
import LocaleType from './src/enums/LocaleType';
import currentLocale from './src/utiles/currentLocale';
import { Dashboard } from './src/modules/dashboard/Dashboard';
import pusherClient from './src/api/pusherClient';
import userChannel from './src/utiles/userChannel';
import Main from './src/modules/main/Main';
import Notification from './src/types/Notification';
import NotificationContext from './src/contexts/NotificationContext';

interface AppState {
  signedIn: boolean;
  locale: LocaleType;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    kycStatus: KycStatus;
    gender: string;
  };
  unreadNotificationCount: number;
  notifications: Notification[];
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
  },
  unreadNotificationCount: 0,
  notifications: [],
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = defaultState;
  }

  async componentDidMount() {
    await this.signIn();
  }

  signIn = async () => {
    await Api.me()
      .then(async (res) => {
        this.setState({
          signedIn: true,
          user: res.data.user,
          unreadNotificationCount: res.data.unreadNotificationCount,
        });

        const pusher = await pusherClient();
        const channel = pusher.subscribe(userChannel(res.data.user.id));
        channel.bind('notification', this.handleNotification);
      })
      .catch(() => {
        this.setState(defaultState);
      });
  };

  handleNotification = (notification: Notification) => {
    this.setState({
      unreadNotificationCount: this.state.unreadNotificationCount + 1,
      notifications: [notification, ...this.state.notifications],
    });
  }

  signOut = async () => {
    await AsyncStorage.removeItem('@token');
    this.setState(defaultState);
  };

  render() {
    const RootStack = createStackNavigator();

    return (
      <NavigationContainer>
        <UserContext.Provider
          value={{
            ...this.state,
            signIn: this.signIn,
            signOut: this.signOut,
          }}>
          <NotificationContext.Provider
            value={{
              notifications: this.state.notifications,
              unreadNotificationCount: this.state.unreadNotificationCount,
              setUnreadNotificationCount: (value) => {
                this.setState({ unreadNotificationCount: value >= 0 ? value : 0 });
              },
              setNotifications: (notifications) => { this.setState({ notifications }); },
            }}
          >
            <RootStack.Navigator
              headerMode="none"
              screenOptions={{
                gestureEnabled: false,
              }}>
              {this.state.signedIn ? (
                <>
                  <RootStack.Screen
                    name={'Main'}
                    component={Main}
                  />
                  {this.state.user.kycStatus === KycStatus.NONE && (
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
          </NotificationContext.Provider>
        </UserContext.Provider>
      </NavigationContainer>
    );
  }
}

export default App;
