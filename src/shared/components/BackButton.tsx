import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
} from "react-native";

export const BackButton: FunctionComponent<{
  handler: (event: GestureResponderEvent) => void;
}> = ({ handler }) => {
  return (
    <View style={styles.backButton}>
      <TouchableOpacity onPress={handler}>
        <Image source={require("../assets/images/backbutton.png")} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
