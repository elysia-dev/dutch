import React, { FunctionComponent } from "react";
import {
  GestureResponderEvent,
  TouchableOpacity,
} from "react-native";
import { P3Text } from './Texts';

export const FlatButton: FunctionComponent<{
  title: string;
  handler: (event: GestureResponderEvent) => void;
}> = ({ title, handler }) => {
  return (
    <TouchableOpacity onPress={handler}>
      <P3Text label={title} style={{
        color: "#1c1c1c",
        fontSize: 13,
        lineHeight: 15,
        textAlign: "center",
      }}/>
    </TouchableOpacity>
  );
};
