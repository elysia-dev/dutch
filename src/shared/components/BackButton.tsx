import React, { FunctionComponent } from "react";
import {
  View,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Image,
  TouchableOpacity,
} from "react-native";
import BackButtonImg from "../assets/images/backbutton.png";
import BackButtonWhiteImg from "../assets/images/backbutton_white.png";

export const BackButton: FunctionComponent<{
  handler: (event: GestureResponderEvent) => void;
  isWhite?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ handler, isWhite = false, style = {} }) => {
  return (
    <View style={style}>
      <TouchableOpacity
        onPress={handler}
        style={{
          backgroundColor: 'transparent',
          marginBottom: 25,
          marginTop: 13,
        }}
      >
        <Image
          source={isWhite === true ? BackButtonWhiteImg : BackButtonImg}
          style={{
            width: 30,
            height: 30,
            left: -8,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
