import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
// import StorybookUIRoot from "./storybook/index";

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import styled from 'styled-components/native';
import { Kyc } from './src/modules/kyc/Kyc';
import { More } from './src/modules/more/More';
import { Products } from './src/modules/products/Products';
import { Account } from './src/modules/account/Account';
import { Notification } from './src/modules/notification/Notification';

import DashboardBlackPng from './src/shared/assets/images/dashboard_black.png';
import DashboardPng from './src/shared/assets/images/dashboard.png';
import ProductBlackPng from './src/shared/assets/images/product_black.png';
import ProductPng from './src/shared/assets/images/product.png';
import NotificationBlackPng from './src/shared/assets/images/notification_black.png';
import NotificationPng from './src/shared/assets/images/notification.png';
import OptionsPng from './src/shared/assets/images/options.png';
import OptionsBlackPng from './src/shared/assets/images/options_black.png';

import UserContext from './src/contexts/UserContext';
import { KycStatus } from './src/enums/KycStatus';
import Api from './src/api/account';
import LocaleType from './src/enums/LocaleType';
import currentLocale from './src/utiles/currentLocale';
import { Dashboard } from './src/modules/dashboard/Dashboard';
import MainInfo from './src/modules/more/MainInfo';
import { MainList } from './src/modules/products/MainList';
import { Main } from './src/modules/dashboard/Main';

const STORYBOOK_START = false;

const Icon = styled.Image`
  width: 26px;
  height: 26px;
`;

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
};

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  async componentDidMount() {
    await this.signIn();
  }

  signIn = async () => {
    await Api.me()
      .then((res) => {
        this.setState({
          signedIn: true,
          user: res.data.user,
          unreadNotificationCount: res.data.unreadNotificationCount,
        });
        console.log(this.state);
      })
      .catch(() => {
        this.setState(defaultState);
      });
  };

  signOut = async () => {
    await AsyncStorage.removeItem('@token');
    this.setState(defaultState);
  };

  TabNavigatior = () => {
    const Tab = createBottomTabNavigator();

    return (
      <Tab.Navigator
        initialRouteName="DashboardMain"
        tabBarOptions={{ showLabel: false }}>
        <Tab.Screen
          name="DashboardMain"
          component={Main}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Icon
                source={focused ? DashboardBlackPng : DashboardPng}
                style={{ width: 30, height: 30 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ProductsMain"
          component={MainList}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Icon source={focused ? ProductBlackPng : ProductPng} />
            ),
          }}
        />
        <Tab.Screen
          name="NotificationMain"
          component={Notification}
          options={{
            // tabBarBadge: this.state.unreadNotificationCount,
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <View>
                <Icon
                  source={focused ? NotificationBlackPng : NotificationPng}
                  style={{ resizeMode: 'contain' }}
                />
                {this.state.unreadNotificationCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -3,
                      left: 23,
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#3679B5',
                    }}></View>
                )}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="MoreMain"
          component={MainInfo}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Image
                style={{
                  resizeMode: 'center',
                  height: 25,
                  width: 25,
                }}
                source={focused ? OptionsBlackPng : OptionsPng}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
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
          {/* {STORYBOOK_START && <StorybookUIRoot />} */}
          <RootStack.Navigator
            headerMode="none"
            screenOptions={{
              gestureEnabled: false,
            }}>
            {this.state.signedIn ? (
              <>
                <RootStack.Screen
                  name={'Main'}
                  component={this.TabNavigatior}
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
        </UserContext.Provider>
      </NavigationContainer>
    );
  }
}

export default App;
