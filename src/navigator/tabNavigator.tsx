import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Platform } from "react-native";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <View style={{ width: "100%", position: "absolute", bottom: 0 }}>
      <Tab.Navigator>
        <Tab.Screen name="Test" component={Kyc} />
        <Tab.Screen name="Info" component={Info} />
      </Tab.Navigator>
    </View>
  );
}
