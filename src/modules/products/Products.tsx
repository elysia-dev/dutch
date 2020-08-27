import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { MainList } from "./MainList";
import { Filter } from "./Filter";
import { ProductPage } from "../../enums/pageEnum";

interface props {}

const Stack = createStackNavigator();

export const Products = () => {
  return (
    <Stack.Navigator initialRouteName={ProductPage.MainList} headerMode="none">
      <Stack.Screen name={ProductPage.MainList} component={MainList} />
      <Stack.Screen name={ProductPage.Filter} component={Filter} />
    </Stack.Navigator>
  );
};
