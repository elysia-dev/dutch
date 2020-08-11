import React, { FunctionComponent } from "react";
import { StyleSheet, View, Button, GestureResponderEvent } from "react-native";

export const SubmitButton: FunctionComponent<{
  title: string;
  // handler: (event: GestureResponderEvent) => void;
  handler: (stage: number) => void;
  // handler: any;
  nextStage: number;
}> = ({ title, handler, nextStage }) => {
  return (
    <View>
      <Button
        onPress={() => handler(nextStage)}
        title={title}
     />
    </View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    flex: 1,
    backgroundColor: "#2c6190",
  },
});
