import React, { FunctionComponent } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { P3Text } from './Texts';

const FlatBorderButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <TouchableOpacity
      onPress={handler}
      style={{
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#36a1ff',
        height: 21,
        paddingVertical: 3,
        paddingHorizontal: 21,
      }}
    >
      <P3Text label={title} style={{
        color: "#1c1c1c",
        textAlign: "center",
        lineHeight: 15,
      }} />
    </TouchableOpacity>
  );
};

export default FlatBorderButton;
