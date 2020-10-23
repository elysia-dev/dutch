import React, { FunctionComponent, useContext, useState } from 'react';
import { Image, View, ViewProps, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';

import DashboardBlackPng from '../../shared/assets/images/dashboard_black.png';
import DashboardPng from '../../shared/assets/images/dashboard.png';
import ProductBlackPng from '../../shared/assets/images/product_black.png';
import ProductPng from '../../shared/assets/images/product.png';
import NotificationBlackPng from '../../shared/assets/images/notification_black.png';
import NotificationPng from '../../shared/assets/images/notification.png';
import OptionsPng from '../../shared/assets/images/options.png';
import OptionsBlackPng from '../../shared/assets/images/options_black.png';
import MainInfo from '../more/MainInfo';
import MainList from '../products/MainList';
import { Main as DashBoardMain } from '../dashboard/Main';
import Notifications from '../notification/Notifications';
import RootContext from '../../contexts/RootContext';

const Icon = styled.Image`
  width: 26px;
  height: 26px;
`;

const Tab = createBottomTabNavigator();

const Main: FunctionComponent = () => {
  const { unreadNotificationCount } = useContext(RootContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} forceInset={{ bottom: 'always', top: 'never' }} >
      <Tab.Navigator
        initialRouteName="DashboardMain"
        tabBarOptions={{
          showLabel: false,
          style: { height: 50, position: 'absolute', bottom: 0 },
        }}>
        <Tab.Screen
          name="DashboardMain"
          component={DashBoardMain}
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
              <Icon
                source={focused ? ProductBlackPng : ProductPng}
                style={{ width: 30, height: 30 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="NotificationMain"
          component={Notifications}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <>
                <Icon
                  source={focused ? NotificationBlackPng : NotificationPng}
                  style={{
                    height: 30,
                    width: 25,
                  }}
                />
                {unreadNotificationCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 30,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#FC5C4F',
                    }} />
                )}
              </>
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
                  width: 25,
                }}
                source={focused ? OptionsBlackPng : OptionsPng}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Main;
