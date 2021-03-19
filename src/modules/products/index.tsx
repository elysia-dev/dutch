import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { ProductPage } from '../../enums/pageEnum';
import ProductBuying from './ProductBuying';
import Purchase from '../asset/Purchase';

const RootStack = createNativeStackNavigator();

const Main: React.FC = () => {
  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
        stackPresentation: 'formSheet'
      }}
    >
      <RootStack.Screen
        name={ProductPage.ProductBuying}
        component={ProductBuying}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={ProductPage.Purchase}
        component={Purchase}
      />
    </RootStack.Navigator>
  );
};

export default Main