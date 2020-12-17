import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-navigation';
import { ProductPage } from '../../enums/pageEnum';
import ProductBuying from './ProductBuying';
import PaymentSelection from './PaymentSelection';
import ProductStory from './ProductStory';

const Stack = createStackNavigator();

export const Products = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFF',
      }}
      forceInset={{ top: 'always', bottom: 'always' }}>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          gestureEnabled: false,
        }}>
        <Stack.Screen
          name={ProductPage.ProductBuying}
          component={ProductBuying}
        />
        <Stack.Screen
          name={ProductPage.ProductStory}
          component={ProductStory}
        />
        <Stack.Screen
          name={ProductPage.PaymentSelection}
          component={PaymentSelection}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};
