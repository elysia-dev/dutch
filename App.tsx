import React from 'react';
import i18n from 'i18n-js';

import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

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
    language: LocaleType.KO,
    ethAddresses: [],
  },
  unreadNotificationCount: 0,
  notifications: [],
};

class App extends React.Component<{}, AppState> {
  token!: string | null;
  authServer!: Server;
  constructor(props: {}) {
    super(props);
    this.state = defaultState;
  }

  navigationRef: React.RefObject<any> = React.createRef();

  signOut = async () => {
    await AsyncStorage.removeItem('@token');
    this.setState(defaultState);
  };

  autoSignOut = async () => {
    await AsyncStorage.removeItem('@token');
    this.setState(defaultState);
    this.navigationRef.current.navigate('Account', { screen: AccountPage.ExpiredAccount });
  };

  async componentDidMount() {
    await this.signIn();
    if (!this.state.locale) i18n.locale = this.state.locale;
  }

  signIn = async () => {
    const token = await AsyncStorage.getItem('@token');
    this.authServer = new Server(this.autoSignOut, token !== null ? token : '');
    await this.authServer
      .me()
      .then(async res => {
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
  };

  render() {
    const RootStack = createStackNavigator();

    return (
      <NavigationContainer ref={this.navigationRef}>
        <RootContext.Provider
          value={{
            ...this.state,
            signIn: this.signIn,
            signOut: this.signOut,
            autoSignOut: this.autoSignOut,
            setUnreadNotificationCount: (value: number) => {
              this.setState({
                unreadNotificationCount: value >= 0 ? value : 0,
              });
            },
            setNotifications: (notifications: Notification[]) => {
              this.setState({ notifications });
            },
            Server: this.authServer,
          }}>
          <RootStack.Navigator
            headerMode="none"
            screenOptions={{
              gestureEnabled: false,
            }}>
            {this.state.signedIn ? (
              <>
                <RootStack.Screen name={'Main'} component={Main} />
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
        </RootContext.Provider>
      </NavigationContainer>
    );
  }
}

const STORY_BOOK_ENABLED = false;

const AppContainer = () =>
  __DEV__ && STORY_BOOK_ENABLED ? <StorybookUI /> : <App />;

export default AppContainer;
