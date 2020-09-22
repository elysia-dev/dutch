import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { MainList } from './MainList';
import { ProductPage } from '../../enums/pageEnum';
import ProductBuying from './ProductBuying';
import ProductStory from './ProductStory';
import SliderProductBuying from './SliderProductBuying';

const Stack = createStackNavigator();

export const Products = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen name={ProductPage.ProductStory} component={ProductStory} />
      <Stack.Screen name={'BuyModalStack'} component={BuyModalStack} />
    </Stack.Navigator>
  );
};

const BuyModalStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 0.5, 0.9, 1],
              outputRange: [0, 0.25, 0.7, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'clamp',
            }),
          },
        }),
      }}>
      <Stack.Screen
        name={ProductPage.ProductBuying}
        component={ProductBuying}
      />
      <Stack.Screen
        name={ProductPage.SliderProductBuying}
        component={SliderProductBuying}
      />
    </Stack.Navigator>
  );
};
