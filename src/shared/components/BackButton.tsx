import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
  Text,
} from "react-native";
import styled from 'styled-components/native';
import BackButtonImg from '../../../src/shared/assets/images/backbutton.png';

const ArrowImg = styled.Image`
  width: 16px;
  height: 16px;
  margin: 12px;
`;
const WhiteBtn = styled.TouchableOpacity`
  background-color: #fff;
`;
export const BackButton: FunctionComponent<{
  handler: (event: GestureResponderEvent) => void;
}> = ({ handler }) => {
  return (
    <View>
      <WhiteBtn onPress={handler}>
        <ArrowImg source={BackButtonImg} />
      </WhiteBtn>
    </View>
  );
};
