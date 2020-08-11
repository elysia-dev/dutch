import React, { FunctionComponent } from "react";
import { StyleSheet, View, Button, GestureResponderEvent } from "react-native";

export const SubmitButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <View style={styles.submitButton}>
      <Button onPress={handler} title={title} />
    </View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    flex: 1,
    backgroundColor: "#2c6190",
  },
});
