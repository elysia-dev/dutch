import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import styled from "styled-components/native";
import BackButtonImg from "../../../src/shared/assets/images/backbutton.png";
import BackButtonWhiteImg from "../../../src/shared/assets/images/backbutton_white.png";

const ArrowImg = styled.Image`
  width: 16px;
  height: 16px;
`;
const WhiteBtn = styled.TouchableOpacity`
  background-color: transparent;
`;
export const BackButton: FunctionComponent<{
  handler: (event: GestureResponderEvent) => void;
  isWhite?: boolean;
  style: StyleProp<ViewStyle>;
}> = ({ handler, isWhite = false, style = {} }) => {
  return (
    <View style={style}>
      <WhiteBtn onPress={handler}>
        <ArrowImg
          source={isWhite === true ? BackButtonWhiteImg : BackButtonImg}
        />
      </WhiteBtn>
    </View>
  );
};
