import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { MainList } from "./MainList";
import { Filter } from "./Filter";
import { ProductPage } from "../../enums/pageEnum";
import ProductInfo from "./ProductInfo";

const Stack = createStackNavigator();

export const Products = () => {
  return (
    <Stack.Navigator initialRouteName={ProductPage.MainList} headerMode="none">
      <Stack.Screen name={ProductPage.MainList} component={MainList} />
      <Stack.Screen name={ProductPage.Filter} component={Filter} />
      <Stack.Screen name={ProductPage.ProductInfo} component={ProductInfo} />
    </Stack.Navigator>
  );
};
