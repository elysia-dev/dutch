import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { InfoPage } from "../../enums/pageEnum";
import { MainInfo } from "./MainInfo";
import { MyPage } from "./Mypage";
import { OwnershipHistory } from "./OwnershipHistory";
import { TransactionHistory } from "./TransactionHistory";

const Stack = createStackNavigator();

export const Info = () => {
  return (
    <Stack.Navigator initialRouteName={InfoPage.MainInfo} headerMode="none">
      <Stack.Screen name={InfoPage.MainInfo} component={MainInfo} />
      <Stack.Screen name={InfoPage.MyPage} component={MyPage} />
      <Stack.Screen
        name={InfoPage.OwnershipHistory}
        component={OwnershipHistory}
      />
      <Stack.Screen
        name={InfoPage.TransactionHistory}
        component={TransactionHistory}
      />
    </Stack.Navigator>
  );
};
