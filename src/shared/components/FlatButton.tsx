import React, { FunctionComponent } from "react";
import { StyleSheet, View, Button, GestureResponderEvent } from "react-native";

export const FlatButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <View style={styles.flatButton}>
      <Button onPress={handler} title={title} />
    </View>
  );
};

const styles = StyleSheet.create({
  flatButton: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
