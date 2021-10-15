import React, { FunctionComponent, useContext } from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardBlackPng from '../../shared/assets/images/dashboard_black.png';
import DashboardPng from '../../shared/assets/images/dashboard.png';
import ProductBlackPng from '../../shared/assets/images/product_black.png';
import ProductPng from '../../shared/assets/images/product.png';
import StakingPng from '../../shared/assets/images/staking.png';
import StakingBlackPng from '../../shared/assets/images/staking_black.png';
import OptionsPng from '../../shared/assets/images/options.png';
import OptionsBlackPng from '../../shared/assets/images/options_black.png';
import MainInfo from '../more/MainInfo';
import MainList from '../products/MainList';
import { Main as DashBoardMain } from '../dashboard/Main';
import { Main as StakingMain } from '../staking/Main';
import UserContext from '../../contexts/UserContext';
import { MainPage } from '../../enums/pageEnum';
import AppColors from '../../enums/AppColors';

const Tab = createBottomTabNavigator();

const Main: FunctionComponent = () => {
  const { user, isWalletUser } = useContext(UserContext);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: AppColors.WHITE }}
      forceInset={{ top: 'never', bottom: 'always' }}>
      <Tab.Navigator
        initialRouteName="DashboardMain"
        tabBarOptions={{
          showLabel: false,
          style: {
            height: 50,
            bottom: 0,
          },
        }}>
        <Tab.Screen
          name={MainPage.DashboardMain}
          component={DashBoardMain}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? DashboardBlackPng : DashboardPng}
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  top: 8,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name={MainPage.ProductsMain}
          component={MainList}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? ProductBlackPng : ProductPng}
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  top: 8,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name={MainPage.StakingMain}
          component={StakingMain}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? StakingBlackPng : StakingPng}
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  top: 8,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name={MainPage.MoreMain}
          component={MainInfo}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => (
              <>
                <Image
                  style={{
                    top: 20,
                    height: 5,
                    width: 25,
                    position: 'absolute',
                  }}
                  source={focused ? OptionsBlackPng : OptionsPng}
                />
                {!isWalletUser && !(user.ethAddresses?.length > 0) && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 25,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: AppColors.NOTICE_RED,
                    }}
                  />
                )}
              </>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Main;
