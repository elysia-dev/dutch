import React from 'react';
import { storiesOf } from "@storybook/react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LockAccount from "../../../src/modules/account/LockAccount";
import InitializeEmail from "../../../src/modules/account/InitializeEmail";

const Stack = createStackNavigator();

storiesOf("Account", module).add("LockAccount", () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name='lockaccount' component={LockAccount} />
    </Stack.Navigator>
  </NavigationContainer>
)).add("InitializeEmail", () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name='init' component={InitializeEmail} />
    </Stack.Navigator>
  </NavigationContainer>
));
