import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Platform } from "react-native";
import { Account } from "../modules/account/Account";
import { InitializeEmail } from "../modules/account/InitializeEmail";
import { Signup } from "../modules/account/Signup";
import { Login } from "../modules/account/Login";
import { ChangePassword } from "../modules/account/ChangePassword";
import { LockAccount } from "../modules/account/LockAccount";
import { CertifyEmail } from "../modules/account/components/CertifyEmail";

const Stack = createStackNavigator();

export function accountNavigator() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} /> */}
    </Stack.Navigator>
  );
}
