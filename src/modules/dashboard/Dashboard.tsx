import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DashboardPage } from "../../enums/pageEnum";
import { Main } from "./Main";
import { MyAsset } from "./MyAsset";

const Stack = createStackNavigator();

export const Dashboard = () => {
  return (
    <Stack.Navigator initialRouteName={DashboardPage.Main} headerMode="none">
      <Stack.Screen name={DashboardPage.Main} component={Main} />
      <Stack.Screen name={DashboardPage.MyAsset} component={MyAsset} />
    </Stack.Navigator>
  );
};
