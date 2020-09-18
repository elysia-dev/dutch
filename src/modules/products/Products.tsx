import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { MainList } from "./MainList";
import { ProductPage } from "../../enums/pageEnum";
import ProductBuying from "./ProductBuying";
import ProductStory from "./ProductStory";

const Stack = createStackNavigator();

export const Products = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={ProductPage.ProductStory} component={ProductStory} />
      <Stack.Screen
        name={ProductPage.ProductBuying}
        component={ProductBuying}
      />
    </Stack.Navigator>
  );
};
