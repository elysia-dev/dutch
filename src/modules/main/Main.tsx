import React, { FunctionComponent, useContext } from 'react';
import { Image, View } from 'react-native';
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
import { MainList } from '../products/MainList';
import { Main as DashBoardMain } from '../dashboard/Main';
import Notifications from '../notification/Notifications';
import NotificationContext from '../../contexts/NotificationContext';

const Icon = styled.Image`
  width: 26px;
  height: 26px;
`;

const Tab = createBottomTabNavigator();

const Main: FunctionComponent = () => {
  const { unreadNotificationCount } = useContext(NotificationContext);

  return (
    <Tab.Navigator
      initialRouteName="DashboardMain"
      tabBarOptions={{ showLabel: false }}>
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
            <Icon source={focused ? ProductBlackPng : ProductPng} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationMain"
        component={Notifications}
        options={{
          // tabBarBadge: this.state.unreadNotificationCount,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View>
              <Icon
                source={focused ? NotificationBlackPng : NotificationPng}
                style={{ resizeMode: 'contain' }}
              />
              {unreadNotificationCount > 0 && (
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

export default Main;
